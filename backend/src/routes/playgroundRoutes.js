const express = require('express');
const router = express.Router();
const playgroundController = require('../controllers/playgroundController');
const { authenticateToken, optionalAuthenticateToken } = require('../middlewares/auth');

router.post('/save', authenticateToken, playgroundController.saveCode);
router.get('/load', authenticateToken, playgroundController.loadCode);
router.post('/execute', optionalAuthenticateToken, playgroundController.executeCode);
router.post('/share', optionalAuthenticateToken, playgroundController.shareSnippet);
router.get('/snippet/:id', playgroundController.getSnippet);

module.exports = router;
