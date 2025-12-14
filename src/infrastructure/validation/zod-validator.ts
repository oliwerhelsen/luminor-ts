import { zValidator } from '@hono/zod-validator';
import type { ZodSchema } from 'zod';

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
