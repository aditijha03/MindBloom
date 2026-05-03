const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../../controllers/auth.controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/authenticate');
const { RegisterBody, LoginBody, ForgotPasswordBody, ResetPasswordBody } = require('../../schemas/auth.schema');

const router = express.Router();

const isDev = process.env.NODE_ENV !== 'production';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 100 : 10, // relaxed in development, strict in production
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many authentication attempts, please try again after 15 minutes.'
    }
  }
});

router.post('/register', authLimiter, validate(RegisterBody), authController.register);
router.post('/login', authLimiter, validate(LoginBody), authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh', authController.refreshToken); // No authenticate - uses cookie
router.post('/forgot-password', authLimiter, validate(ForgotPasswordBody), authController.forgotPassword);
router.post('/reset-password', validate(ResetPasswordBody), authController.resetPassword);

module.exports = router;
