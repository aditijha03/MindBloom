const express = require('express');
const router = express.Router();

// Placeholder for actual routes
router.get('/', (req, res) => {
  res.json({
    message: 'MindBloom API v1'
  });
});

const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const postsRoutes = require('./posts.routes');
const commentsRoutes = require('./comments.routes');
const assessmentsRoutes = require('./assessments.routes');
const childProfilesRoutes = require('./childProfiles.routes');
const milestonesRoutes = require('./milestones.routes');

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/child-profiles', childProfilesRoutes);
router.use('/milestones', milestonesRoutes);
router.use('/posts', postsRoutes);
router.use('/posts', commentsRoutes);
router.use('/assessments', assessmentsRoutes);

const bloombotRoutes = require('./bloombot.routes');
router.use('/bloombot', bloombotRoutes);

module.exports = router;
