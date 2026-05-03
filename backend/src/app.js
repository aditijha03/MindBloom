const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const requestLogger = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');
const v1Router = require('./v1/routes');

const app = express();

// 1. Helmet: security headers
app.use(helmet());

// 2. CORS: restricted to frontend origin
app.use(cors({
  origin: env.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Body Parser: JSON
app.use(express.json({ limit: '10kb' }));

// 4. Body Parser: URL Encoded
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Cookie Parser
app.use(cookieParser());

// 6. Request Logger
app.use(requestLogger);

// 7. Global Rate Limiter: 300 req / 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', globalLimiter);

// 8. Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the MindBloom API v1. Please use /api/v1 for resources.',
    documentation: '/health'
  });
});

// 9. Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 9. API Router v1
app.use('/api/v1', v1Router);

// 10. 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.url} not found.`
    }
  });
});

// 11. Global Error Handler (MUST be last)
app.use(errorHandler);

module.exports = app;
