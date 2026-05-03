const authService = require('../services/auth.service');
const { success } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const env = require('../config/env');

const register = asyncHandler(async (req, res) => {
  const { email, password, displayName } = req.body;
  const user = await authService.register({ email, password, displayName });
  return success(req, res, { user }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, expiresAt, user } = await authService.login({ email, password });

  // Set refresh token cookie
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth/refresh',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  return success(req, res, { accessToken, expiresAt, user });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.token);
  res.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' });
  return success(req, res, { message: 'Logged out successfully.' });
});

const refreshToken = asyncHandler(async (req, res) => {
  const rawToken = req.cookies.refresh_token;

  if (!rawToken) {
    throw new AppError('Refresh token missing.', 401, 'UNAUTHENTICATED');
  }

  const { accessToken, refreshToken: newRefreshToken, expiresAt } = await authService.refreshToken(rawToken);

  // Rotate refresh token cookie
  res.cookie('refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth/refresh',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  return success(req, res, { accessToken, expiresAt });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { message } = await authService.forgotPassword(email);
  return success(req, res, { message });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const { message } = await authService.resetPassword(token, password);
  return success(req, res, { message });
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
};
