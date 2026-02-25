import { z } from 'zod';

export const createTournamentSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  sportType: z.enum(['cricket', 'football', 'volleyball']),
  maxTeams: z.number().int().min(2).max(64).default(16),
  minPlayersPerTeam: z.number().int().min(1).max(30).default(11),
  maxPlayersPerTeam: z.number().int().min(1).max(30).default(15),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  venue: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  allowPublicJoin: z.boolean().default(true),
});

export const listTournamentsSchema = z.object({
  sport: z.enum(['cricket', 'football', 'volleyball']).optional(),
  status: z
    .enum(['draft', 'open', 'ongoing', 'completed', 'cancelled'])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const tournamentIdSchema = z.object({
  id: z.string().uuid(),
});

export const inviteCodeSchema = z.object({
  inviteCode: z.string().min(1),
});

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
export type ListTournamentsInput = z.infer<typeof listTournamentsSchema>;
