import { pgTable, uuid, text, timestamp, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tournaments } from './tournaments.schema';
import { teams } from './teams.schema';
import { users } from './users.schema';

// Enums
export const matchStatusEnum = pgEnum('match_status', [
  'scheduled',
  'live',
  'completed',
  'cancelled',
  'postponed',
]);

// Matches Table
export const matches = pgTable('matches', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Tournament & teams
  tournamentId: uuid('tournament_id')
    .references(() => tournaments.id, { onDelete: 'cascade' })
    .notNull(),
  teamAId: uuid('team_a_id')
    .references(() => teams.id)
    .notNull(),
  teamBId: uuid('team_b_id')
    .references(() => teams.id)
    .notNull(),

  // Match details
  matchNumber: integer('match_number'),
  round: text('round'),
  status: matchStatusEnum('status').default('scheduled').notNull(),

  // Schedule
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),

  // Venue
  venue: text('venue'),
  fieldNumber: text('field_number'),

  // Toss (Cricket specific)
  tossWonBy: uuid('toss_won_by').references(() => teams.id),
  tossDecision: text('toss_decision'),

  // Score (flexible JSONB per sport)
  score: jsonb('score').default({}),

  // Live data (for real-time updates)
  liveData: jsonb('live_data'),

  // Result
  winnerId: uuid('winner_id').references(() => teams.id),
  resultType: text('result_type'),
  resultDescription: text('result_description'),

  // Officials
  refereeName: text('referee_name'),
  umpireNames: text('umpire_names').array(),

  // Match summary
  manOfTheMatch: uuid('man_of_the_match').references(() => users.id),
  highlightsUrl: text('highlights_url'),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const matchesRelations = relations(matches, ({ one, many }) => ({
  // Tournament
  tournament: one(tournaments, {
    fields: [matches.tournamentId],
    references: [tournaments.id],
  }),

  // Team A
  teamA: one(teams, {
    fields: [matches.teamAId],
    references: [teams.id],
    relationName: 'teamAMatches',
  }),

  // Team B
  teamB: one(teams, {
    fields: [matches.teamBId],
    references: [teams.id],
    relationName: 'teamBMatches',
  }),

  // Winner
  winner: one(teams, {
    fields: [matches.winnerId],
    references: [teams.id],
    relationName: 'wonMatches',
  }),

  // Man of the match
  manOfMatch: one(users, {
    fields: [matches.manOfTheMatch],
    references: [users.id],
  }),

  // Match events
  events: many('matchEvents'),
}));

// Type exports
export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;
