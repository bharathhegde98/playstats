import { Context } from 'hono';
import { tournamentsService } from './tournaments.service';
import { ResponseHelper } from '../../shared/utils/response';
import type { AuthContext } from '../../shared/middleware/auth.middleware';

export class TournamentsController {
  async list(c: Context) {
    const query = c.get('validatedQuery');
    const tournaments = await tournamentsService.listTournaments(query);
    return ResponseHelper.success(c, tournaments);
  }

  async create(c: Context) {
    const auth = c.get('auth') as AuthContext;
    const body = c.get('validatedBody');
    const tournament = await tournamentsService.createTournament(body, auth.userId);
    return ResponseHelper.created(c, tournament);
  }

  async getById(c: Context) {
    const { id } = c.get('validatedParams');
    const tournament = await tournamentsService.getTournamentById(id);
    return ResponseHelper.success(c, tournament);
  }

  async getByInviteCode(c: Context) {
    const { inviteCode } = c.get('validatedParams');
    const tournament = await tournamentsService.getTournamentByInviteCode(inviteCode);
    return ResponseHelper.success(c, tournament);
  }
}

export const tournamentsController = new TournamentsController();
