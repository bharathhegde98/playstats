import { Hono } from 'hono';
import { authController } from './auth.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { validateBody } from '../../shared/middleware/validation.middleware';
import { signUpSchema, signInSchema, updateProfileSchema } from './auth.schema';

export const authRoutes = new Hono();

// Public routes
authRoutes.post('/signup', validateBody(signUpSchema), (c) => authController.signUp(c));
authRoutes.post('/signin', validateBody(signInSchema), (c) => authController.signIn(c));

// Protected routes
authRoutes.get('/me', authMiddleware, (c) => authController.getProfile(c));
authRoutes.patch('/profile', authMiddleware, validateBody(updateProfileSchema), (c) =>
  authController.updateProfile(c)
);
authRoutes.post('/signout', authMiddleware, (c) => authController.signOut(c));
