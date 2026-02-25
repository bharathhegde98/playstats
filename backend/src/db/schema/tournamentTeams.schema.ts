import { pgTable, uuid, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tournaments } from './tournaments.schema';
import { teams } from './teams.schema';

// Tournament Teams Table (Many-to-Many junction)
export const tournamentTeams = pgTable(
  'tournament_teams',
  {
    tournamentId: uuid('tournament_id')
      .references(() => tournaments.id, { onDelete: 'cascade' })
      .notNull(),
    teamId: uuid('team_id')
      .references(() => teams.id, { onDelete: 'cascade' })
      .notNull(),

    // Status
    status: text('status').default('confirmed').notNull(),

    // Timestamp
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.tournamentId, table.teamId] }),
  })
);

// Relations
export const tournamentTeamsRelations = relations(tournamentTeams, ({ one }) => ({
  // Tournament
  tournament: one(tournaments, {
    fields: [tournamentTeams.tournamentId],
    references: [tournaments.id],
  }),

  // Team
  team: one(teams, {
    fields: [tournamentTeams.teamId],
    references: [teams.id],
  }),
}));

// Type exports
export type TournamentTeam = typeof tournamentTeams.$inferSelect;
export type NewTournamentTeam = typeof tournamentTeams.$inferInsert;
