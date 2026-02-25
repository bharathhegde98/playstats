import { Hono } from 'hono';
import { tournamentsController } from './tournaments.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import {
  validateBody,
  validateQuery,
  validateParams,
} from '../../shared/middleware/validation.middleware';
import {
  createTournamentSchema,
  listTournamentsSchema,
  tournamentIdSchema,
  inviteCodeSchema,
} from './tournaments.schema';

export const tournamentsRoutes = new Hono();

// Public
tournamentsRoutes.get(
  '/',
  validateQuery(listTournamentsSchema),
  (c) => tournamentsController.list(c)
);

tournamentsRoutes.get(
  '/join/:inviteCode',
  validateParams(inviteCodeSchema),
  (c) => tournamentsController.getByInviteCode(c)
);

tournamentsRoutes.get(
  '/:id',
  validateParams(tournamentIdSchema),
  (c) => tournamentsController.getById(c)
);

// Protected
tournamentsRoutes.post(
  '/',
  authMiddleware,
  validateBody(createTournamentSchema),
  (c) => tournamentsController.create(c)
);
