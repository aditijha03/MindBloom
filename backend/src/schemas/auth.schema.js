const Joi = require('joi');

const RegisterBody = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string()
    .min(8)
    .max(72)
    .pattern(/[A-Z]/, 'uppercase letter')
    .pattern(/[0-9]/, 'number')
    .required(),
  displayName: Joi.string().min(2).max(50).trim().required()
});

const LoginBody = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required()
});

const ForgotPasswordBody = Joi.object({
  email: Joi.string().email().lowercase().trim().required()
});

const ResetPasswordBody = Joi.object({
  token: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .max(72)
    .pattern(/[A-Z]/, 'uppercase letter')
    .pattern(/[0-9]/, 'number')
    .required()
});

module.exports = {
  RegisterBody,
  LoginBody,
  ForgotPasswordBody,
  ResetPasswordBody
};
