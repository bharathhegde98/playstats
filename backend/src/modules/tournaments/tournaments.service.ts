import { and, eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '../../db/client';
import { tournaments } from '../../db/schema';
import { NotFoundError, DatabaseError } from '../../shared/utils/errors';
import { logger } from '../../shared/utils/logger';
import type { CreateTournamentInput, ListTournamentsInput } from './tournaments.schema';

export class TournamentsService {
  async listTournaments(input: ListTournamentsInput) {
    try {
      const { sport, status, page, limit } = input;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (sport) conditions.push(eq(tournaments.sportType, sport));
      if (status) conditions.push(eq(tournaments.status, status));

      const results = await db.query.tournaments.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [desc(tournaments.createdAt)],
        limit,
        offset,
        with: {
          creator: {
            columns: { id: true, fullName: true, username: true },
          },
        },
      });

      return results;
    } catch (error) {
      logger.error('List tournaments error', error);
      throw new DatabaseError('Failed to fetch tournaments');
    }
  }

  async createTournament(input: CreateTournamentInput, userId: string) {
    try {
      const slug =
        input.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') +
        '-' +
        nanoid(6);

      const inviteCode = nanoid(8);
      const inviteLink = `/join/${inviteCode}`;

      const [tournament] = await db
        .insert(tournaments)
        .values({
          name: input.name,
          slug,
          description: input.description,
          sportType: input.sportType,
          maxTeams: input.maxTeams ?? 16,
          minPlayersPerTeam: input.minPlayersPerTeam ?? 11,
          maxPlayersPerTeam: input.maxPlayersPerTeam ?? 15,
          startDate: new Date(input.startDate),
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          venue: input.venue,
          city: input.city,
          country: input.country,
          allowPublicJoin: input.allowPublicJoin ?? true,
          inviteCode,
          inviteLink,
          status: 'draft',
          createdBy: userId,
          currentTeams: 0,
        })
        .returning();

      logger.info('Tournament created', { tournamentId: tournament.id, userId });
      return tournament;
    } catch (error) {
      logger.error('Create tournament error', error);
      throw new DatabaseError('Failed to create tournament');
    }
  }

  async getTournamentById(id: string) {
    const tournament = await db.query.tournaments.findFirst({
      where: eq(tournaments.id, id),
      with: {
        creator: {
          columns: { id: true, fullName: true, username: true },
        },
      },
    });

    if (!tournament) throw new NotFoundError('Tournament');
    return tournament;
  }

  async getTournamentByInviteCode(inviteCode: string) {
    const tournament = await db.query.tournaments.findFirst({
      where: eq(tournaments.inviteCode, inviteCode),
      with: {
        creator: {
          columns: { id: true, fullName: true, username: true },
        },
      },
    });

    if (!tournament) throw new NotFoundError('Tournament');
    return tournament;
  }
}

export const tournamentsService = new TournamentsService();
