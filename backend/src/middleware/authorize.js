const AppError = require('../utils/AppError');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authenticated.', 401, 'UNAUTHENTICATED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(`Access denied. Required role: ${allowedRoles.join(' or ')}.`, 403, 'FORBIDDEN'));
    }

    next();
  };
};

module.exports = authorize;
