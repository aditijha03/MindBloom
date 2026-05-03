const Joi = require('joi');
const AppError = require('../utils/AppError');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message.replace(/['"]/g, '')
      }));
      return next(new AppError('Validation failed.', 400, 'VALIDATION_ERROR', details));
    }

    req.body = value;
    next();
  };
};

validate.params = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      convert: true
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message.replace(/['"]/g, '')
      }));
      return next(new AppError('Invalid parameters.', 400, 'INVALID_PARAM', details));
    }

    req.params = value;
    next();
  };
};

validate.query = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      convert: true,
      allowUnknown: false
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message.replace(/['"]/g, '')
      }));
      return next(new AppError('Invalid query string.', 400, 'INVALID_QUERY', details));
    }

    req.query = value;
    next();
  };
};

module.exports = validate;
