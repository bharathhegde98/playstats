import { eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { users } from '../../db/schema';
import { supabaseAdmin } from '../../shared/utils/supabase.client';
import { ConflictError, NotFoundError, UnauthorizedError, DatabaseError } from '../../shared/utils/errors';
import { logger } from '../../shared/utils/logger';
import type { SignUpInput, SignInInput, UpdateProfileInput } from './auth.schema';

/* ============================= */
/* Types */
/* ============================= */

type DbUser = typeof users.$inferSelect;

export type AuthResponse = {
  user: DbUser;
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
};

/* ============================= */
/* Auth Service */
/* ============================= */

export class AuthService {

  /* ============================= */
  /* SIGN UP */
  /* ============================= */

  async signUp(input: SignUpInput): Promise<AuthResponse> {
    try {
      // Check existing phone
      const existingPhone = await db.query.users.findFirst({
        where: eq(users.phoneNumber, input.phoneNumber),
      });

      if (existingPhone && existingPhone.status === 'active') {
        throw new ConflictError('Phone number already registered');
      }

      // Check existing email
      const existingEmail = await db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (existingEmail) {
        throw new ConflictError('Email already registered');
      }

      /* ============================= */
      /* Create user in Supabase Admin */
      /* ============================= */

      const { data: createdUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email: input.email,
          password: input.password,
          email_confirm: true,
          user_metadata: {
            phone_number: input.phoneNumber,
            full_name: input.fullName,
            username: input.username,
          },
        });

      if (createError || !createdUser.user) {
        logger.error('Supabase createUser error', createError);
        throw new DatabaseError('Failed to create user account');
      }

      /* ============================= */
      /* Sign in to generate session */
      /* ============================= */

      const { data: signInData, error: signInError } =
        await supabaseAdmin.auth.signInWithPassword({
          email: input.email,
          password: input.password,
        });

      if (signInError || !signInData.session) {
        logger.error('Supabase signIn after signup error', signInError);
        throw new DatabaseError('Failed to generate session');
      }

      /* ============================= */
      /* Create / Claim DB User */
      /* ============================= */

      let dbUser: DbUser;

      if (existingPhone && existingPhone.status === 'shadow') {
        const [updatedUser] = await db
          .update(users)
          .set({
            status: 'active',
            email: input.email,
            username: input.username,
            authUserId: createdUser.user.id,
            claimedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(users.id, existingPhone.id))
          .returning();

        dbUser = updatedUser;
      } else {
        const [newUser] = await db
          .insert(users)
          .values({
            phoneNumber: input.phoneNumber,
            email: input.email,
            fullName: input.fullName,
            username: input.username,
            status: 'active',
            role: 'user',
            authUserId: createdUser.user.id,
          })
          .returning();

        dbUser = newUser;
      }

      logger.info('User signed up successfully', { userId: dbUser.id });

      return {
        user: dbUser,
        session: {
          access_token: signInData.session.access_token,
          refresh_token: signInData.session.refresh_token,
          expires_in: signInData.session.expires_in,
          token_type: signInData.session.token_type,
        },
      };

    } catch (error) {
      if (error instanceof ConflictError || error instanceof DatabaseError) {
        throw error;
      }

      logger.error('Sign up error', error);
      throw new DatabaseError('Failed to create user');
    }
  }

  /* ============================= */
  /* SIGN IN */
  /* ============================= */

  async signIn(input: SignInInput): Promise<AuthResponse> {
    try {
      const { data, error } =
        await supabaseAdmin.auth.signInWithPassword({
          email: input.email,
          password: input.password,
        });

      if (error || !data.user || !data.session) {
        throw new UnauthorizedError('Invalid email or password');
      }

      const user = await db.query.users.findFirst({
        where: eq(users.authUserId, data.user.id),
      });

      if (!user) {
        throw new NotFoundError('User');
      }

      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));

      logger.info('User signed in', { userId: user.id });

      return {
        user,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_in: data.session.expires_in,
          token_type: data.session.token_type,
        },
      };

    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Sign in error', error);
      throw new UnauthorizedError('Authentication failed');
    }
  }

  /* ============================= */
  /* GET PROFILE */
  /* ============================= */

  async getProfile(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    const { passwordHash, ...profile } = user;
    return profile;
  }

  /* ============================= */
  /* UPDATE PROFILE */
  /* ============================= */

  async updateProfile(userId: string, input: UpdateProfileInput) {
    try {
      const [updatedUser] = await db
        .update(users)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser) {
        throw new NotFoundError('User');
      }

      const { passwordHash, ...profile } = updatedUser;
      return profile;

    } catch (error) {
      logger.error('Update profile error', error);
      throw new DatabaseError('Failed to update profile');
    }
  }

  /* ============================= */
  /* SIGN OUT */
  /* ============================= */

  async signOut(token: string) {
    try {
      const { error } = await supabaseAdmin.auth.admin.signOut(token);

      if (error) {
        logger.warn('Sign out error', error);
      }

      return { success: true };
    } catch (error) {
      logger.error('Sign out error', error);
      return { success: false };
    }
  }
}

export const authService = new AuthService();