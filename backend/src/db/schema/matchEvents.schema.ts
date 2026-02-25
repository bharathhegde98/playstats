import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { matches } from './matches.schema';
import { users } from './users.schema';
import { teams } from './teams.schema';

// Match Events Table
export const matchEvents = pgTable('match_events', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Match relationship
  matchId: uuid('match_id')
    .references(() => matches.id, { onDelete: 'cascade' })
    .notNull(),

  // Event details
  eventType: text('event_type').notNull(),
  eventTimestamp: timestamp('event_timestamp', { withTimezone: true }).defaultNow().notNull(),
  matchTime: text('match_time'),

  // Who did it
  playerId: uuid('player_id').references(() => users.id),
  teamId: uuid('team_id')
    .references(() => teams.id)
    .notNull(),

  // Event data (flexible per event type)
  data: jsonb('data').notNull(),

  // Metadata
  commentary: text('commentary'),
  createdBy: uuid('created_by').references(() => users.id),

  // Timestamp
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const matchEventsRelations = relations(matchEvents, ({ one }) => ({
  // Match
  match: one(matches, {
    fields: [matchEvents.matchId],
    references: [matches.id],
  }),

  // Player
  player: one(users, {
    fields: [matchEvents.playerId],
    references: [users.id],
    relationName: 'playerEvents',
  }),

  // Team
  team: one(teams, {
    fields: [matchEvents.teamId],
    references: [teams.id],
  }),

  // Created by
  creator: one(users, {
    fields: [matchEvents.createdBy],
    references: [users.id],
    relationName: 'createdEvents',
  }),
}));

// Type exports
export type MatchEvent = typeof matchEvents.$inferSelect;
export type NewMatchEvent = typeof matchEvents.$inferInsert;
