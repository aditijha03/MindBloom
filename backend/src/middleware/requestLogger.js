const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
  req.requestId = uuidv4();
  res.setHeader('X-Request-Id', req.requestId);

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, path, ip } = req;
    const { statusCode } = res;
    const userAgent = req.headers['user-agent'];
    const userId = req.user?.id || null;

    let level = 'info';
    if (statusCode >= 500) {
      level = 'error';
    } else if (statusCode >= 400) {
      level = 'warn';
    }

    logger[level]('HTTP Request', {
      requestId: req.requestId,
      method,
      path,
      statusCode,
      durationMs: duration,
      userId,
      ip,
      userAgent
    });
  });

  next();
};

module.exports = requestLogger;
