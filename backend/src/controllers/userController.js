const db = require('../config/db');
const { awardBadge, recordUserActivity } = require('../utils/activityLogger');

const syncAchievements = async (req, res) => {
  try {
    const { challengeCount } = req.body;
    const userId = req.user.id;
    const unlocked = [];

    const userRes = await db.query('SELECT streak_count FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0] || { streak_count: 0 };

    const topicsRes = await db.query('SELECT COUNT(*) as t_count FROM user_progress WHERE user_id = $1', [userId]);
    const topicCount = parseInt(topicsRes.rows[0].t_count, 10);

    const quizzesRes = await db.query('SELECT COUNT(*) as q_count FROM concept_scores WHERE user_id = $1 AND score = 100', [userId]);
    const perfectQuizCount = parseInt(quizzesRes.rows[0].q_count, 10);

    const conditions = {
      'first_login': true,
      'streak_3': user.streak_count >= 3,
      'streak_7': user.streak_count >= 7,
      'first_challenge': (challengeCount || 0) >= 1,
      'challenge_5': (challengeCount || 0) >= 5,
      'quiz_perfect': perfectQuizCount >= 1,
      'roadmap_path_1': topicCount >= 1
    };

    for (const [code, met] of Object.entries(conditions)) {
      if (met) {
        const achRes = await db.query('SELECT id, title, icon, rarity, description FROM achievements WHERE code = $1', [code]);
        if (achRes.rows.length > 0) {
          const ach = achRes.rows[0];
          try {
            await db.query('INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2)', [userId, ach.id]);
            unlocked.push(ach);
          } catch (e) {
            // Already earned
          }
        }
      }
    }

    const result = await db.query(`
      SELECT a.*, ua.earned_at 
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = $1
      ORDER BY ua.earned_at DESC;
    `, [userId]);

    const allResult = await db.query('SELECT * FROM achievements ORDER BY id ASC');

    res.json({
      earned: result.rows,
      all: allResult.rows,
      newlyUnlocked: unlocked
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHeatmap = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM user_activities 
      WHERE user_id = $1 
      GROUP BY DATE(created_at) 
      ORDER BY date ASC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBadges = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT badge_id, earned_at 
      FROM user_badges 
      WHERE user_id = $1 
      ORDER BY earned_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    // Fetch user details, progress, scores, and challenges in parallel to speed up loading
    const [userResult, progressResult, scoresResult, challengesResult] = await Promise.all([
      db.query('SELECT id, username, email, level, xp, streak_count, github_username FROM users WHERE id = $1', [req.user.id]),
      db.query('SELECT topic_id FROM user_progress WHERE user_id = $1', [req.user.id]),
      db.query('SELECT * FROM concept_scores WHERE user_id = $1', [req.user.id]),
      db.query('SELECT challenge_id FROM completed_challenges WHERE user_id = $1', [req.user.id])
    ]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userResult.rows[0];

    // Get Completed topics array
    const completedTopics = progressResult.rows.map(row => row.topic_id);

    // Get Concept quiz scores dictionary
    const conceptScores = {};
    scoresResult.rows.forEach(row => {
      conceptScores[row.concept_key] = {
        score: row.score,
        selected: row.selected_option,
        conceptTitle: row.concept_title,
        topicId: row.topic_id,
        topicTitle: row.topic_title,
        timestamp: row.created_at
      };
    });

    // Get Completed Challenges list
    const completedChallenges = challengesResult.rows.map(row => row.challenge_id);

    res.json({
      user,
      completedTopics,
      conceptScores,
      completedChallenges
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { github_username } = req.body;
  try {
    await db.query('UPDATE users SET github_username = $1 WHERE id = $2', [github_username || null, req.user.id]);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProgress = async (req, res) => {
  const { topicId, completed } = req.body;
  if (!topicId) return res.status(400).json({ error: 'Missing topicId' });

  try {
    const streakResult = await recordUserActivity(req.user.id, 'roadmap_progress');
    const currentStreak = streakResult ? streakResult.streak_count : null;

    if (completed) {
      await db.query(
        'INSERT INTO user_progress (user_id, topic_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [req.user.id, topicId]
      );
    } else {
      await db.query(
        'DELETE FROM user_progress WHERE user_id = $1 AND topic_id = $2',
        [req.user.id, topicId]
      );
    }
    res.json({ success: true, streak_count: currentStreak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const saveConceptScore = async (req, res) => {
  const { conceptKey, score, selectedOption, conceptTitle, topicId, topicTitle } = req.body;
  if (!conceptKey || score === undefined) return res.status(400).json({ error: 'Missing conceptKey or score' });

  try {
    // 1. Record activity and update daily streak
    await recordUserActivity(req.user.id, 'quiz_complete');

    // 2. Insert the quiz attempt. DO NOTHING if they already answered this question.
    const insertResult = await db.query(`
      INSERT INTO concept_scores (user_id, concept_key, score, selected_option, concept_title, topic_id, topic_title)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id, concept_key) DO NOTHING
      RETURNING id
    `, [req.user.id, conceptKey, score, selectedOption, conceptTitle, topicId, topicTitle]);

    const wasInserted = insertResult.rows.length > 0;

    // 3. Award 10 XP if they passed AND this was their first attempt (wasInserted)
    let xpAdded = 0;
    const userXpQuery = await db.query('SELECT xp, level, streak_count FROM users WHERE id = $1', [req.user.id]);
    let newXp = userXpQuery.rows[0]?.xp || 0;
    let newLevel = userXpQuery.rows[0]?.level || 1;
    let currentStreak = userXpQuery.rows[0]?.streak_count || 0;

    if (score === 1 && wasInserted) {
      xpAdded = 10;
      newXp += xpAdded;
      newLevel = Math.floor(newXp / 100) + 1;

      await db.query('UPDATE users SET xp = $1, level = $2 WHERE id = $3', [newXp, newLevel, req.user.id]);
      
      // Award Badge for First Bug Squashed (first passed quiz)
      awardBadge(req.user.id, 'first_bug_squashed');
    }

    res.json({ 
      success: true, 
      xpAdded, 
      newXp, 
      newLevel, 
      streak_count: currentStreak,
      locked: !wasInserted 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const solveChallenge = async (req, res) => {
  const { challengeId } = req.body;
  if (!challengeId) return res.status(400).json({ error: 'Missing challengeId' });

  try {
    // 1. Record activity and update daily streak
    await recordUserActivity(req.user.id, 'challenge_solved');

    // 2. Check if already solved
    const checkSolved = await db.query(
      'SELECT id FROM completed_challenges WHERE user_id = $1 AND challenge_id = $2',
      [req.user.id, challengeId]
    );

    // Get current updated stats from users table (which includes daily streak updates)
    const userXpQuery = await db.query('SELECT xp, level, streak_count FROM users WHERE id = $1', [req.user.id]);
    let currentXp = userXpQuery.rows[0]?.xp || 0;
    let currentLevel = userXpQuery.rows[0]?.level || 1;
    const currentStreak = userXpQuery.rows[0]?.streak_count || 0;

    if (checkSolved.rows.length > 0) {
      return res.json({ 
        success: true, 
        xpAdded: 0, 
        newXp: currentXp, 
        newLevel: currentLevel, 
        streak_count: currentStreak 
      }); // Already solved previously
    }

    // 3. Insert completion
    await db.query(
      'INSERT INTO completed_challenges (user_id, challenge_id) VALUES ($1, $2)',
      [req.user.id, challengeId]
    );

    // 4. Award 50 XP
    const xpAdded = 50;
    const newXp = currentXp + xpAdded;
    const newLevel = Math.floor(newXp / 100) + 1;

    await db.query('UPDATE users SET xp = $1, level = $2 WHERE id = $3', [newXp, newLevel, req.user.id]);

    res.json({ success: true, xpAdded, newXp, newLevel, streak_count: currentStreak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const submitProject = async (req, res) => {
  const { topicId, githubUrl, liveUrl } = req.body;
  if (!topicId || !githubUrl) return res.status(400).json({ error: 'Topic ID and GitHub URL are required' });

  try {
    await db.query(`
      INSERT INTO user_projects (user_id, topic_id, github_url, live_url) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, topic_id) 
      DO UPDATE SET github_url = EXCLUDED.github_url, live_url = EXCLUDED.live_url, created_at = CURRENT_TIMESTAMP
    `, [req.user.id, topicId, githubUrl, liveUrl || null]);
    res.json({ message: 'Project submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM user_projects WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  syncAchievements,
  getHeatmap,
  getBadges,
  getProfile,
  updateProfile,
  updateProgress,
  saveConceptScore,
  solveChallenge,
  submitProject,
  getProjects
};
