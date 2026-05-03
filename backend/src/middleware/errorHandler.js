const logger = require('../config/logger');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let { statusCode, code, message, details } = err;

  // Set defaults
  statusCode = statusCode || 500;
  code = code || 'INTERNAL_ERROR';
  message = message || 'Something went wrong. Please try again.';

  // Handle known Supabase/Postgres errors
  if (err.message) {
    if (err.message.includes('duplicate key')) {
      statusCode = 409;
      code = 'CONFLICT';
      message = 'A resource with this value already exists.';
    } else if (err.message.includes('invalid input syntax for type uuid')) {
      statusCode = 400;
      code = 'INVALID_ID';
      message = 'Invalid ID format.';
    } else if (err.message.includes('JWT')) {
      statusCode = 401;
      code = 'INVALID_TOKEN';
    }
  }

  // Log unexpected bugs (non-operational errors)
  if (!err.isOperational || statusCode === 500) {
    logger.error('Unexpected Error:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      userId: req.user?.id,
      requestId: req.requestId
    });
  }

  const response = {
    success: false,
    error: {
      code,
      message: (err.isOperational || env.nodeEnv === 'development') ? message : 'Something went wrong. Please try again.',
      ...(details && { details })
    },
    meta: {
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    }
  };

  res.status(statusCode).json(response);
};

module.exports = { errorHandler };
