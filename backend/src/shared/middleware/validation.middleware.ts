import { Context, Next } from 'hono';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

export const validateBody = (schema: ZodSchema) => {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const validated = schema.parse(body);
      c.set('validatedBody', validated);
      await next();
    } catch (error) {
      throw error;
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (c: Context, next: Next) => {
    try {
      const query = c.req.query();
      const validated = schema.parse(query);
      c.set('validatedQuery', validated);
      await next();
    } catch (error) {
      throw error;
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return async (c: Context, next: Next) => {
    try {
      const params = c.req.param();
      const validated = schema.parse(params);
      c.set('validatedParams', validated);
      await next();
    } catch (error) {
      throw error;
    }
  };
};
