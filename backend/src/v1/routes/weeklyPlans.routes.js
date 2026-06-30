const express = require('express');
const router = express.Router();
const weeklyPlansController = require('../../controllers/weeklyPlans.controller');
const { authenticate } = require('../../middleware/authenticate');

router.use(authenticate);

router.get('/', weeklyPlansController.getLatestPlan);
router.post('/', weeklyPlansController.createPlan);
router.patch('/:id/feedback', weeklyPlansController.updateFeedback);

module.exports = router;
