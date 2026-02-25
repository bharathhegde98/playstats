import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check for required environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create postgres connection
const connectionString = process.env.DATABASE_URL;

// For migrations
export const migrationClient = postgres(connectionString, { max: 1 });

// For queries
const queryClient = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(queryClient, { schema });

// Type exports
export type Database = typeof db;

console.log('✅ Database client initialized');
