const express = require('express');
const milestonesController = require('../../controllers/milestones.controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/authenticate');
const { CreateMilestoneBody, UpdateMilestoneBody } = require('../../schemas/milestones.schema');

const router = express.Router();

router.use(authenticate);

router.get('/:childId', milestonesController.getMilestones);
router.post('/', validate(CreateMilestoneBody), milestonesController.createMilestone);
router.patch('/:id', validate(UpdateMilestoneBody), milestonesController.updateMilestone);

module.exports = router;
