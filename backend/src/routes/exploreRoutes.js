const express = require('express');
const router = express.Router();
const playgroundController = require('../controllers/playgroundController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/snippets', playgroundController.exploreSnippets);
router.post('/snippets/:id/upvote', authenticateToken, playgroundController.upvoteSnippet);

module.exports = router;
