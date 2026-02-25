import { eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { users } from '../../db/schema';
import { supabaseAdmin } from '../../shared/utils/supabase.client';
import { ConflictError, NotFoundError, UnauthorizedError, DatabaseError } from '../../shared/utils/errors';
import { logger } from '../../shared/utils/logger';
import type { SignUpInput, SignInInput, PhoneSignInInput, UpdateProfileInput } from './auth.schema';

export class AuthService {
  /**
   * Sign up new user
   */
  async signUp(input: SignUpInput) {
    try {
      // Check if phone number already exists
      const existingPhone = await db.query.users.findFirst({
        where: eq(users.phoneNumber, input.phoneNumber),
      });

      if (existingPhone && existingPhone.status === 'active') {
        throw new ConflictError('Phone number already registered');
      }

      // Check if email already exists
      const existingEmail = await db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (existingEmail) {
        throw new ConflictError('Email already registered');
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true,
        user_metadata: {
          phone_number: input.phoneNumber,
          full_name: input.fullName,
          username: input.username,
        },
      });

      if (authError || !authData.user) {
        logger.error('Supabase auth error', authError);
        throw new DatabaseError('Failed to create user account');
      }

      // If shadow account exists, claim it
      if (existingPhone && existingPhone.status === 'shadow') {
        // Update shadow account to active
        const [updatedUser] = await db
          .update(users)
          .set({
            status: 'active',
            email: input.email,
            username: input.username,
            authUserId: authData.user.id,
            claimedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(users.id, existingPhone.id))
          .returning();

        logger.info('Shadow account claimed', { userId: updatedUser.id });

        return {
          user: updatedUser,
          session: authData.session,
        };
      }

      // Create new user in our database
      const [newUser] = await db
        .insert(users)
        .values({
          phoneNumber: input.phoneNumber,
          email: input.email,
          fullName: input.fullName,
          username: input.username,
          status: 'active',
          role: 'user',
          authUserId: authData.user.id,
        })
        .returning();

      logger.info('New user created', { userId: newUser.id });

      return {
        user: newUser,
        session: authData.session,
      };
    } catch (error) {
      if (error instanceof ConflictError || error instanceof DatabaseError) {
        throw error;
      }
      logger.error('Sign up error', error);
      throw new DatabaseError('Failed to create user');
    }
  }

  /**
   * Sign in with email
   */
  async signIn(input: SignInInput) {
    try {
      // Sign in with Supabase
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error || !data.user) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Get user from our database
      const user = await db.query.users.findFirst({
        where: eq(users.authUserId, data.user.id),
      });

      if (!user) {
        throw new NotFoundError('User');
      }

      // Update last login
      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));

      return {
        user,
        session: data.session,
      };
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Sign in error', error);
      throw new UnauthorizedError('Authentication failed');
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    // Remove sensitive data
    const { passwordHash, ...profile } = user;

    return profile;
  }

  /**
   * Update user profile
   */
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

  /**
   * Sign out
   */
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
