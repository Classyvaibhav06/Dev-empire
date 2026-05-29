const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/achievements/sync', authenticateToken, userController.syncAchievements);
router.get('/heatmap', authenticateToken, userController.getHeatmap);
router.get('/badges', authenticateToken, userController.getBadges);
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);
router.post('/progress', authenticateToken, userController.updateProgress);
router.post('/concept-score', authenticateToken, userController.saveConceptScore);
router.post('/challenge', authenticateToken, userController.solveChallenge);
router.post('/projects/submit', authenticateToken, userController.submitProject);
router.get('/projects', authenticateToken, userController.getProjects);

module.exports = router;
