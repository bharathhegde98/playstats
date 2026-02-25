import { pgTable, uuid, text, timestamp, jsonb, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { tournaments } from './tournaments.schema';

// Teams Table
export const teams = pgTable(
  'teams',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Tournament relationship
    tournamentId: uuid('tournament_id')
      .references(() => tournaments.id, { onDelete: 'cascade' })
      .notNull(),

    // Team info
    name: text('name').notNull(),
    shortName: text('short_name'),
    logoUrl: text('logo_url'),
    colorPrimary: text('color_primary'),
    colorSecondary: text('color_secondary'),

    // Team manager/captain
    managerId: uuid('manager_id')
      .references(() => users.id)
      .notNull(),
    captainId: uuid('captain_id').references(() => users.id),

    // Status
    status: text('status').default('pending').notNull(),

    // Team stats
    stats: jsonb('stats').default({ wins: 0, losses: 0, draws: 0, points: 0 }),

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    // Unique constraint: same team name not allowed in same tournament
    uniqueTeamPerTournament: unique().on(table.tournamentId, table.name),
  })
);

// Relations
export const teamsRelations = relations(teams, ({ one, many }) => ({
  // Tournament
  tournament: one(tournaments, {
    fields: [teams.tournamentId],
    references: [tournaments.id],
  }),

  // Manager
  manager: one(users, {
    fields: [teams.managerId],
    references: [users.id],
    relationName: 'managedTeams',
  }),

  // Captain
  captain: one(users, {
    fields: [teams.captainId],
    references: [users.id],
    relationName: 'captainedTeams',
  }),

  // Players
  players: many('teamPlayers'),

  // Matches (as team A)
  matchesAsTeamA: many('matches', {
    relationName: 'teamAMatches',
  }),

  // Matches (as team B)
  matchesAsTeamB: many('matches', {
    relationName: 'teamBMatches',
  }),

  // Tournament registration
  tournamentRegistration: one('tournamentTeams'),
}));

// Type exports
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
