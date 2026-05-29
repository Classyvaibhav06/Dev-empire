const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const chatRoutes = require('./chatRoutes');
const playgroundRoutes = require('./playgroundRoutes');
const exploreRoutes = require('./exploreRoutes');
const roadmapRoutes = require('./roadmapRoutes');
const topicRoutes = require('./topicRoutes');

// Healthcheck Route
router.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Mounting Sub-routers
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/playground', playgroundRoutes);
router.use('/explore', exploreRoutes);
router.use('/topics', topicRoutes);

// Root level API mappings (chat, roadmap, leaderboard, enrichment)
router.use('/', chatRoutes);
router.use('/', roadmapRoutes);

module.exports = router;
