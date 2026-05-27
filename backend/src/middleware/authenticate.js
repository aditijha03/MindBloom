const { supabaseAnon } = require('../config/supabase');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required.', 401, 'UNAUTHENTICATED'));
  }

  const token = authHeader.split(' ')[1];

  // Local JWT verification (no network call)
  const { data: { user }, error } = await supabaseAnon.auth.getUser(token);

  if (error || !user) {
    return next(new AppError('Invalid or expired token.', 401, 'INVALID_TOKEN'));
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.user_metadata?.role || 'user'
  };
  req.token = token;

  next();
});

const authenticateStrong = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required.', 401, 'UNAUTHENTICATED'));
  }

  const token = authHeader.split(' ')[1];

  // Network call to verify session is still active
  const { data: { user }, error } = await supabaseAnon.auth.getUser(token);

  if (error || !user) {
    return next(new AppError('Session is invalid or has expired.', 401, 'INVALID_SESSION'));
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.user_metadata?.role || 'user'
  };
  req.token = token;

  next();
});

const optionalAuthenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const { data: { user }, error } = await supabaseAnon.auth.getUser(token);
      if (!error && user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.user_metadata?.role || 'user'
        };
        req.token = token;
      }
    } catch (err) {
      // Ignore token verification errors for optional auth
    }
  }

  next();
});

module.exports = {
  authenticate,
  authenticateStrong,
  optionalAuthenticate
};

