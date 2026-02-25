import { pgTable, uuid, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { tournaments } from './tournaments.schema';
import { teams } from './teams.schema';
import { matches } from './matches.schema';

// Enums
export const notificationTypeEnum = pgEnum('notification_type', [
  'tournament_invite',
  'team_invite',
  'match_reminder',
  'match_started',
  'match_completed',
  'account_claimed',
  'team_approved',
  'team_rejected',
]);

// Notifications Table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  type: notificationTypeEnum('type').notNull(),

  title: text('title').notNull(),
  message: text('message'),

  // Related entities
  relatedTournamentId: uuid('related_tournament_id').references(() => tournaments.id, {
    onDelete: 'cascade',
  }),
  relatedTeamId: uuid('related_team_id').references(() => teams.id, { onDelete: 'cascade' }),
  relatedMatchId: uuid('related_match_id').references(() => matches.id, { onDelete: 'cascade' }),

  // Action link
  actionUrl: text('action_url'),
  actionLabel: text('action_label'),

  // Status
  read: boolean('read').default(false).notNull(),
  readAt: timestamp('read_at', { withTimezone: true }),

  // Timestamp
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  // User
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),

  // Related tournament
  relatedTournament: one(tournaments, {
    fields: [notifications.relatedTournamentId],
    references: [tournaments.id],
  }),

  // Related team
  relatedTeam: one(teams, {
    fields: [notifications.relatedTeamId],
    references: [teams.id],
  }),

  // Related match
  relatedMatch: one(matches, {
    fields: [notifications.relatedMatchId],
    references: [matches.id],
  }),
}));

// Type exports
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
