const Joi = require('joi');

const SaveAssessmentBody = Joi.object({
  score: Joi.number().integer().min(0).max(100).required(),
  resultType: Joi.string().valid('fine', 'alert', 'warning', 'activity').required(),
  summary: Joi.string().allow('').optional(),
  responses: Joi.object().required()
});

const AnalyzeAssessmentBody = Joi.object({
  type: Joi.string().valid('quiz', 'screening').required(),
  responses: Joi.object().required(),
  ageGroup: Joi.string().allow('').optional(),
  milestones: Joi.object().optional()
});

module.exports = {
  SaveAssessmentBody,
  AnalyzeAssessmentBody
};

