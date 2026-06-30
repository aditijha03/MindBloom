const assessmentsService = require('../services/assessments.service');
const aiAnalysisService = require('../services/aiAnalysis.service');
const { success } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const saveAssessment = asyncHandler(async (req, res) => {
  const assessment = await assessmentsService.saveAssessment(req.user.id, req.body, req.token);
  return success(req, res, { assessment }, 201);
});

const listAssessments = asyncHandler(async (req, res) => {
  const assessments = await assessmentsService.listAssessments(req.user.id, req.token);
  return success(req, res, { assessments });
});

const analyzeAssessment = asyncHandler(async (req, res) => {
  const { type, responses, ageGroup, milestones } = req.body;

  // Run AI analysis (falls back to rule-based analysis if API key is not set)
  const analysis = await aiAnalysisService.analyzeResponses({ type, responses, ageGroup, milestones });

  // If user is authenticated, save the assessment automatically in database
  let savedAssessment = null;
  if (req.user && req.user.id) {
    savedAssessment = await assessmentsService.saveAssessment(req.user.id, {
      score: analysis.score,
      resultType: analysis.resultType === 'warning' ? 'warning' : (analysis.resultType === 'alert' ? 'alert' : 'fine'),
      summary: analysis.summary,
      responses: {
        ...responses,
        aiRecommendations: analysis.recommendations,
        aiDetailedBreakdown: analysis.detailedBreakdown
      }
    }, req.token);
  }

  return success(req, res, { analysis, savedAssessment }, 200);
});

module.exports = {
  saveAssessment,
  listAssessments,
  analyzeAssessment
};

