import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { errorHandler } from './shared/middleware/error.middleware';
import { logger } from './shared/utils/logger';

// Import routes
import { authRoutes } from './modules/auth/auth.routes';
import { tournamentsRoutes } from './modules/tournaments/tournaments.routes';

// Create Hono app
const app = new Hono();

// Global middleware
app.use('*', honoLogger());
app.use('*', prettyJSON());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  '*',
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
const apiPrefix = process.env.API_PREFIX || '/api/v1';

app.route(`${apiPrefix}/auth`, authRoutes);
app.route(`${apiPrefix}/tournaments`, tournamentsRoutes);

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    },
    404
  );
});

// Error handler
app.onError(errorHandler);

logger.info('✅ Hono app initialized');

export default app;
