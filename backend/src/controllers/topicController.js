const db = require('../config/db');

const getComments = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, u.username, u.level 
      FROM topic_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.topic_id = $1
      ORDER BY c.created_at ASC
    `, [req.params.topicId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addComment = async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  try {
    const result = await db.query(`
      INSERT INTO topic_comments (user_id, topic_id, content) 
      VALUES ($1, $2, $3) RETURNING *
    `, [req.user.id, req.params.topicId, content]);

    // Fetch with user details for immediate frontend rendering
    const commentQuery = await db.query(`
      SELECT c.*, u.username, u.level 
      FROM topic_comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `, [result.rows[0].id]);

    res.json(commentQuery.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getComments,
  addComment
};
