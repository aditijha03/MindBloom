const Joi = require('joi');

const SaveAssessmentBody = Joi.object({
  score: Joi.number().integer().min(0).max(100).required(),
  resultType: Joi.string().valid('fine', 'alert', 'warning', 'activity').required(),
  summary: Joi.string().allow('').optional(),
  responses: Joi.object().required()
});

module.exports = {
  SaveAssessmentBody
};
