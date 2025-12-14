import type { Context, MiddlewareHandler } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { ZodSchema } from 'zod';
import type { ValidationTargets } from 'hono';

/**
 * Validation middleware using Zod schemas
 * This is a re-export of the zValidator from @hono/zod-validator for convenience
 */
export function validationMiddleware<T extends ZodSchema>(
  target: keyof ValidationTargets,
  schema: T
): MiddlewareHandler {
  return zValidator(target, schema);
}
