const assessmentsService = require('../services/assessments.service');
const { success } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const saveAssessment = asyncHandler(async (req, res) => {
  const assessment = await assessmentsService.saveAssessment(req.user.id, req.body);
  return success(req, res, { assessment }, 201);
});

const listAssessments = asyncHandler(async (req, res) => {
  const assessments = await assessmentsService.listAssessments(req.user.id);
  return success(req, res, { assessments });
});

module.exports = {
  saveAssessment,
  listAssessments
};
