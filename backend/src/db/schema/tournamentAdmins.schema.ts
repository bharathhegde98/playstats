import { pgTable, uuid, timestamp, jsonb, pgEnum, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tournaments } from './tournaments.schema';
import { users } from './users.schema';

// Enums
export const adminRoleEnum = pgEnum('admin_role', ['creator', 'admin', 'scorer', 'moderator']);

// Tournament Admins Table
export const tournamentAdmins = pgTable(
  'tournament_admins',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    tournamentId: uuid('tournament_id')
      .references(() => tournaments.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),

    role: adminRoleEnum('role').notNull(),

    // Granular permissions
    permissions: jsonb('permissions').default({}),

    // Audit trail
    addedBy: uuid('added_by')
      .references(() => users.id)
      .notNull(),
    addedAt: timestamp('added_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    // User can have only one role per tournament
    uniqueUserPerTournament: unique().on(table.tournamentId, table.userId),
  })
);

// Relations
export const tournamentAdminsRelations = relations(tournamentAdmins, ({ one }) => ({
  // Tournament
  tournament: one(tournaments, {
    fields: [tournamentAdmins.tournamentId],
    references: [tournaments.id],
  }),

  // User
  user: one(users, {
    fields: [tournamentAdmins.userId],
    references: [users.id],
    relationName: 'adminRoles',
  }),

  // Added by
  addedByUser: one(users, {
    fields: [tournamentAdmins.addedBy],
    references: [users.id],
    relationName: 'addedAdmins',
  }),
}));

// Type exports
export type TournamentAdmin = typeof tournamentAdmins.$inferSelect;
export type NewTournamentAdmin = typeof tournamentAdmins.$inferInsert;
