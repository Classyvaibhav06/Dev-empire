const db = require('../config/db');
const { seedData } = require('../constants/roadmapData');

const getRoadmap = async (req, res) => {
  try {
    const { path } = req.query;
    if (path) {
      const filtered = seedData.filter(r => r.id === path);
      return res.json(filtered);
    }
    res.json(seedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { userId } = req.query;

    const topUsersResult = await db.query(
      'SELECT id, username, level, xp FROM users ORDER BY xp DESC LIMIT 50'
    );

    let userRank = null;
    if (userId) {
      const rankQuery = `
        WITH RankedUsers AS (
          SELECT id, xp, level, RANK() OVER (ORDER BY xp DESC) as rank
          FROM users
        )
        SELECT rank, xp, level FROM RankedUsers WHERE id = $1;
      `;
      const rankResult = await db.query(rankQuery, [userId]);
      if (rankResult.rows.length > 0) {
        userRank = rankResult.rows[0];
      }
    }

    res.json({
      topUsers: topUsersResult.rows,
      userRank: userRank
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getRoadmap,
  getLeaderboard
};
