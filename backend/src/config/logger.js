const winston = require('winston');
require('winston-daily-rotate-file');

const { combine, timestamp, json, colorize, printf, errors } = winston.format;

const nodeEnv = process.env.NODE_ENV || 'development';
const logLevel = process.env.LOG_LEVEL || (nodeEnv === 'production' ? 'info' : 'debug');

const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  return `${timestamp} [${level}]: ${stack || message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

const logger = winston.createLogger({
  level: logLevel,
  defaultMeta: { service: 'mindbloom-api' },
  format: combine(
    timestamp(),
    errors({ stack: true }),
    nodeEnv === 'production' ? json() : devFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'HH:mm:ss' }),
        devFormat
      )
    })
  ]
});

if (nodeEnv === 'production') {
  logger.add(new winston.transports.DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '14d',
    level: 'error'
  }));

  logger.add(new winston.transports.DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '14d'
  }));
}

module.exports = logger;
