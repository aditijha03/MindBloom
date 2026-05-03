const Joi = require('joi');

const CreateMilestoneBody = Joi.object({
  childId: Joi.string().uuid().required(),
  category: Joi.string().valid('cognitive', 'social', 'motor', 'language').required(),
  title: Joi.string().min(1).max(200).required(),
  status: Joi.string().valid('not_started', 'in_progress', 'achieved').default('not_started')
});

const UpdateMilestoneBody = Joi.object({
  status: Joi.string().valid('not_started', 'in_progress', 'achieved').required()
});

module.exports = {
  CreateMilestoneBody,
  UpdateMilestoneBody
};
