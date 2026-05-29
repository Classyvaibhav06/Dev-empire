const db = require('../config/db');
const { handleDailyStreak } = require('./streakHelper');

async function logActivity(userId, actionType) {
  try {
    await db.query('INSERT INTO user_activities (user_id, action_type) VALUES ($1, $2)', [userId, actionType]);
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
}

async function awardBadge(userId, badgeId) {
  try {
    await db.query('INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, badgeId]);
  } catch (err) {
    console.error('Failed to award badge:', err.message);
  }
}

const recordUserActivity = async (userId, actionType) => {
  try {
    // 1. Log to user_activities for heatmap
    await logActivity(userId, actionType);

    // 2. Fetch full user to calculate daily streak
    const userRes = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      const streakResult = await handleDailyStreak(user);
      return streakResult;
    }
  } catch (err) {
    console.error('Failed to record user activity:', err.message);
  }
  return null;
};

module.exports = {
  logActivity,
  awardBadge,
  recordUserActivity
};
