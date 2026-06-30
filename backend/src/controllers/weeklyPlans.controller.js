const weeklyPlansService = require('../services/weeklyPlans.service');
const { success } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const getLatestPlan = asyncHandler(async (req, res) => {
  const plan = await weeklyPlansService.getLatestWeeklyPlan(req.user.id, req.token);
  return success(req, res, { plan });
});

const createPlan = asyncHandler(async (req, res) => {
  const plan = await weeklyPlansService.saveWeeklyPlan(req.user.id, req.body, req.token);
  return success(req, res, { plan }, 201);
});

const updateFeedback = asyncHandler(async (req, res) => {
  const plan = await weeklyPlansService.updateWeeklyPlanFeedback(req.params.id, req.user.id, req.body.feedback, req.token);
  return success(req, res, { plan });
});

module.exports = {
  getLatestPlan,
  createPlan,
  updateFeedback
};
