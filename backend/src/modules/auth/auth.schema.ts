import { z } from 'zod';

// Phone number validation (international format)
const phoneRegex = /^\+[1-9]\d{1,14}$/;

// Sign up schema
export const signUpSchema = z.object({
  phoneNumber: z.string().regex(phoneRegex, 'Phone number must be in international format (e.g., +919876543210)'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});

// Sign in schema
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Phone sign in schema (for shadow account claiming)
export const phoneSignInSchema = z.object({
  phoneNumber: z.string().regex(phoneRegex, 'Phone number must be in international format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Update profile schema
export const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type PhoneSignInInput = z.infer<typeof phoneSignInSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
