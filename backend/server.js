const app = require('./src/app');
const logger = require('./src/config/logger');
const env = require('./src/config/env');

// Mock startEmailWorker if it's just a stub
const startEmailWorker = () => {
  logger.info('Email worker stub initialized');
};

const startServer = async () => {
  try {
    // Start background workers
    startEmailWorker();

    const server = app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
    });

    // Handle graceful shutdown
    const gracefulShutdown = () => {
      logger.info('Shutting down gracefully...');
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
