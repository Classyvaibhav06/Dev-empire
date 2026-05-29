const db = require('../config/db');
const { executeCodeLocally } = require('../services/codeExecutor');
const { recordUserActivity, awardBadge } = require('../utils/activityLogger');

const saveCode = async (req, res) => {
  const { code } = req.body;
  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    await db.query(`
      INSERT INTO playground_saves (user_id, code, updated_at) 
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) 
      DO UPDATE SET code = EXCLUDED.code, updated_at = CURRENT_TIMESTAMP
    `, [req.user.id, code]);

    res.json({ message: 'Saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loadCode = async (req, res) => {
  try {
    const result = await db.query('SELECT code FROM playground_saves WHERE user_id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No save found' });
    }
    res.json({ code: result.rows[0].code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const executeCode = async (req, res) => {
  const { code, language } = req.body;
  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  try {
    const data = await executeCodeLocally(language, code);
    
    // Gamification Tracking
    if (req.user) {
      const streakResult = await recordUserActivity(req.user.id, `code_execution_${language}`);
      if (streakResult) {
        data.streak_count = streakResult.streak_count;
        data.newXp = streakResult.new_xp;
        data.newLevel = streakResult.new_level;
      }
      
      // Night Owl Badge (12 AM to 4 AM)
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 4) {
        awardBadge(req.user.id, 'night_owl');
      }

      // Polyglot Badge (check if they have 4 distinct languages)
      const languages = await db.query(
        "SELECT COUNT(DISTINCT action_type) as lang_count FROM user_activities WHERE user_id = $1 AND action_type LIKE 'code_execution_%'", 
        [req.user.id]
      );
      if (parseInt(languages.rows[0].lang_count, 10) >= 4) {
        awardBadge(req.user.id, 'polyglot');
      }
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const shareSnippet = async (req, res) => {
  const { code, html_code, css_code, language, title, description, is_public } = req.body;
  if (!code && !html_code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    const userId = req.user ? req.user.id : null;
    let streakResult = null;
    if (userId) {
      streakResult = await recordUserActivity(userId, 'snippet_shared');
    }

    const result = await db.query(
      `INSERT INTO shared_snippets 
       (user_id, title, description, is_public, code, html_code, css_code, language) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id`,
      [userId, title || 'Untitled Snippet', description || '', is_public || false, code || '', html_code || '', css_code || '', language || 'javascript']
    );

    const responsePayload = { id: result.rows[0].id };
    if (streakResult) {
      responsePayload.streak_count = streakResult.streak_count;
      responsePayload.newXp = streakResult.new_xp;
      responsePayload.newLevel = streakResult.new_level;
    }

    res.json(responsePayload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSnippet = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT s.*, u.username as author 
      FROM shared_snippets s 
      LEFT JOIN users u ON s.user_id = u.id 
      WHERE s.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Snippet not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const exploreSnippets = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT s.id, s.title, s.description, s.language, s.upvotes, s.created_at, u.username as author
      FROM shared_snippets s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.is_public = TRUE
      ORDER BY s.upvotes DESC, s.created_at DESC
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const upvoteSnippet = async (req, res) => {
  const snippetId = req.params.id;
  const userId = req.user.id;
  try {
    const check = await db.query('SELECT * FROM snippet_upvotes WHERE user_id = $1 AND snippet_id = $2', [userId, snippetId]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: 'Already upvoted' });
    }
    
    await db.query('INSERT INTO snippet_upvotes (user_id, snippet_id) VALUES ($1, $2)', [userId, snippetId]);
    await db.query('UPDATE shared_snippets SET upvotes = upvotes + 1 WHERE id = $1', [snippetId]);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  saveCode,
  loadCode,
  executeCode,
  shareSnippet,
  getSnippet,
  exploreSnippets,
  upvoteSnippet
};
