const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken, optionalAuthenticateToken } = require('../middlewares/auth');

router.get('/chat-sessions', authenticateToken, chatController.listSessions);
router.post('/chat-sessions', authenticateToken, chatController.createSession);
router.get('/chat-sessions/:id', authenticateToken, chatController.getSession);
router.put('/chat-sessions/:id', authenticateToken, chatController.updateSession);
router.delete('/chat-sessions/:id', authenticateToken, chatController.deleteSession);
router.post('/chat', optionalAuthenticateToken, chatController.streamChat);
router.post('/concept/enrich', chatController.enrichConcept);

module.exports = router;
