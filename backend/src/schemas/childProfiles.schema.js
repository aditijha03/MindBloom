const Joi = require('joi');

const ChildProfileBody = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  ageMonths: Joi.number().integer().min(0).max(216).required(), // up to 18 years
  gender: Joi.string().allow('').optional(),
  medicalHistory: Joi.string().allow('').optional(),
  concerns: Joi.string().allow('').optional()
});

module.exports = {
  ChildProfileBody
};
