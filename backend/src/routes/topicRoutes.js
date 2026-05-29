const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/:topicId/comments', topicController.getComments);
router.post('/:topicId/comments', authenticateToken, topicController.addComment);

module.exports = router;
