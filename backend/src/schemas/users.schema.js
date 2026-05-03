const Joi = require('joi');

const UserIdParams = Joi.object({
  id: Joi.string().uuid().required()
});

const UpdateProfileBody = Joi.object({
  displayName: Joi.string().min(2).max(50).trim().optional(),
  bio: Joi.string().max(500).allow('').optional()
}).min(1);

module.exports = {
  UserIdParams,
  UpdateProfileBody
};
