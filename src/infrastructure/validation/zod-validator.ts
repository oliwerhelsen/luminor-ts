import { zValidator } from '@hono/zod-validator';
import type { ZodSchema } from 'zod';
import type { ValidationTargets } from 'hono';

/**
 * Create a Zod validator middleware for Hono routes
 * @param target - The validation target (json, query, param, form, header, cookie)
 * @param schema - The Zod schema to validate against
 */
export function zodValidator<T extends ZodSchema>(
  target: keyof ValidationTargets,
  schema: T
) {
  return zValidator(target, schema);
}

/**
 * Validate JSON body
 */
export function validateJson<T extends ZodSchema>(schema: T) {
  return zValidator('json', schema);
}

/**
 * Validate query parameters
 */
export function validateQuery<T extends ZodSchema>(schema: T) {
  return zValidator('query', schema);
}

/**
 * Validate route parameters
 */
export function validateParam<T extends ZodSchema>(schema: T) {
  return zValidator('param', schema);
}

/**
 * Validate form data
 */
export function validateForm<T extends ZodSchema>(schema: T) {
  return zValidator('form', schema);
}
