import { pgTable, uuid, text, timestamp, pgEnum, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';

// Enums
export const tournamentStatusEnum = pgEnum('tournament_status', [
  'draft',
  'open',
  'ongoing',
  'completed',
  'cancelled',
]);

export const sportTypeEnum = pgEnum('sport_type', ['cricket', 'football', 'volleyball']);

// Tournaments Table
export const tournaments = pgTable('tournaments', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Basic info
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  sportType: sportTypeEnum('sport_type').notNull(),

  // Visual
  bannerUrl: text('banner_url'),
  logoUrl: text('logo_url'),

  // Status
  status: tournamentStatusEnum('status').default('draft').notNull(),

  // Ownership
  createdBy: uuid('created_by')
    .references(() => users.id)
    .notNull(),

  // Tournament settings
  maxTeams: integer('max_teams').default(16).notNull(),
  currentTeams: integer('current_teams').default(0).notNull(),
  minPlayersPerTeam: integer('min_players_per_team').default(11).notNull(),
  maxPlayersPerTeam: integer('max_players_per_team').default(15).notNull(),

  // Registration
  registrationOpenAt: timestamp('registration_open_at', { withTimezone: true }),
  registrationCloseAt: timestamp('registration_close_at', { withTimezone: true }),

  // Schedule
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }),

  // Location
  venue: text('venue'),
  city: text('city'),
  country: text('country'),

  // Rules & Format (flexible JSONB)
  rules: jsonb('rules').default({}),

  // Invitation
  inviteCode: text('invite_code').unique(),
  inviteLink: text('invite_link'),
  allowPublicJoin: boolean('allow_public_join').default(true).notNull(),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const tournamentsRelations = relations(tournaments, ({ one, many }) => ({
  // Creator
  creator: one(users, {
    fields: [tournaments.createdBy],
    references: [users.id],
  }),

  // Teams
  teams: many('teams'),

  // Matches
  matches: many('matches'),

  // Admins
  admins: many('tournamentAdmins'),

  // Team registrations
  teamRegistrations: many('tournamentTeams'),
}));

// Type exports
export type Tournament = typeof tournaments.$inferSelect;
export type NewTournament = typeof tournaments.$inferInsert;
