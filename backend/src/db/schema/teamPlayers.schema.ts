import { pgTable, uuid, text, timestamp, boolean, jsonb, pgEnum, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { teams } from './teams.schema';

// Enums
export const playerPositionEnum = pgEnum('player_position', [
  // Cricket
  'batsman',
  'bowler',
  'all_rounder',
  'wicket_keeper',
  // Football
  'goalkeeper',
  'defender',
  'midfielder',
  'forward',
  // Volleyball
  'setter',
  'outside_hitter',
  'middle_blocker',
  'libero',
  'opposite',
]);

// Team Players Table (Junction table)
export const teamPlayers = pgTable(
  'team_players',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Relationships
    teamId: uuid('team_id')
      .references(() => teams.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),

    // Player details
    jerseyNumber: text('jersey_number').notNull(),
    position: playerPositionEnum('position'),
    isCaptain: boolean('is_captain').default(false).notNull(),
    isViceCaptain: boolean('is_vice_captain').default(false).notNull(),

    // Invitation status
    invitationStatus: text('invitation_status').default('accepted').notNull(),
    invitedBy: uuid('invited_by')
      .references(() => users.id)
      .notNull(),
    invitedAt: timestamp('invited_at', { withTimezone: true }).defaultNow().notNull(),
    respondedAt: timestamp('responded_at', { withTimezone: true }),

    // Player stats (specific to this team/tournament)
    stats: jsonb('stats').default({}),

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    // Player can't be added twice to same team
    uniquePlayerPerTeam: unique().on(table.teamId, table.userId),
    // Jersey number unique per team
    uniqueJerseyPerTeam: unique().on(table.teamId, table.jerseyNumber),
  })
);

// Relations
export const teamPlayersRelations = relations(teamPlayers, ({ one }) => ({
  // Team
  team: one(teams, {
    fields: [teamPlayers.teamId],
    references: [teams.id],
  }),

  // User/Player
  user: one(users, {
    fields: [teamPlayers.userId],
    references: [users.id],
    relationName: 'playerMemberships',
  }),

  // Invited by
  inviter: one(users, {
    fields: [teamPlayers.invitedBy],
    references: [users.id],
    relationName: 'playerInvitations',
  }),
}));

// Type exports
export type TeamPlayer = typeof teamPlayers.$inferSelect;
export type NewTeamPlayer = typeof teamPlayers.$inferInsert;
