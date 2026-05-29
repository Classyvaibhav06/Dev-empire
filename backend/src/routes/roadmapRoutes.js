const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');

router.get('/roadmap', roadmapController.getRoadmap);
router.get('/leaderboard', roadmapController.getLeaderboard);

module.exports = router;
