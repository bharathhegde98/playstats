import { pgTable, uuid, text, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const accountStatusEnum = pgEnum('account_status', ['active', 'shadow', 'suspended']);
export const userRoleEnum = pgEnum('user_role', ['user', 'organizer', 'admin']);

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Primary unique identifier
  phoneNumber: text('phone_number').notNull().unique(),

  // Account info
  email: text('email').unique(),
  passwordHash: text('password_hash'),

  // Profile
  fullName: text('full_name').notNull(),
  username: text('username').unique(),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),

  // Account status
  status: accountStatusEnum('status').default('shadow').notNull(),
  role: userRoleEnum('role').default('user').notNull(),

  // Shadow account tracking
  createdBy: uuid('created_by').references(() => users.id),
  claimedAt: timestamp('claimed_at', { withTimezone: true }),

  // Auth integration
  authUserId: uuid('auth_user_id'),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  // Shadow account creator
  creator: one(users, {
    fields: [users.createdBy],
    references: [users.id],
    relationName: 'shadowAccounts',
  }),

  // Shadow accounts created by this user
  shadowAccounts: many(users, {
    relationName: 'shadowAccounts',
  }),

  // Tournaments created
  tournamentsCreated: many('tournaments'),

  // Teams managed
  teamsManaged: many('teams'),

  // Team memberships
  teamMemberships: many('teamPlayers'),

  // Tournament admin roles
  tournamentAdminRoles: many('tournamentAdmins'),

  // Notifications
  notifications: many('notifications'),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
