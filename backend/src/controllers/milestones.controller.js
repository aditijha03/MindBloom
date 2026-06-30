const milestonesService = require('../services/milestones.service');
const { success } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const createMilestone = asyncHandler(async (req, res) => {
  const milestone = await milestonesService.createMilestone(req.user.id, req.body, req.token);
  return success(req, res, { milestone }, 201);
});

const getMilestones = asyncHandler(async (req, res) => {
  const { childId } = req.params;
  const milestones = await milestonesService.getMilestones(req.user.id, childId, req.token);
  return success(req, res, { milestones });
});

const updateMilestone = asyncHandler(async (req, res) => {
  const milestone = await milestonesService.updateMilestone(req.params.id, req.user.id, req.body, req.token);
  return success(req, res, { milestone });
});

module.exports = {
  createMilestone,
  getMilestones,
  updateMilestone
};
