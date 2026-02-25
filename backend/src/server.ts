import { serve } from '@hono/node-server';
import * as dotenv from 'dotenv';
import app from './app';
import { logger } from './shared/utils/logger';
import './db/client'; // Initialize database connection

// Load environment variables
dotenv.config();

const port = parseInt(process.env.PORT || '3000', 10);

// Start server
serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    logger.info(`🚀 PlayStats Backend Server started`);
    logger.info(`📡 Listening on http://localhost:${info.port}`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`📝 API Prefix: ${process.env.API_PREFIX || '/api/v1'}`);
  }
);

// Handle shutdown gracefully
process.on('SIGINT', () => {
  logger.info('👋 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('👋 Shutting down server...');
  process.exit(0);
});
