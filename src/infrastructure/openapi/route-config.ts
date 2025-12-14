import { createRoute } from '@hono/zod-openapi';
import type { AnyZodObject } from 'zod';

export interface RouteDocConfig {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
  summary: string;
  description?: string;
  tags?: string[];
  request?: {
    body?: {
      content: {
        'application/json': {
          schema: AnyZodObject;
        };
      };
    };
    query?: AnyZodObject;
    params?: AnyZodObject;
  };
  responses: Record<number, {
    description: string;
    content?: {
      'application/json': {
        schema: AnyZodObject;
      };
    };
  }>;
}

/**
 * Create a documented route configuration for OpenAPI
 * @param config - Route documentation configuration
 * @returns OpenAPI route configuration
 */
export function createDocumentedRoute(config: RouteDocConfig) {
  return createRoute({
    method: config.method,
    path: config.path,
    summary: config.summary,
    ...(config.description && { description: config.description }),
    ...(config.tags && { tags: config.tags }),
    ...(config.request && { request: config.request }),
    responses: config.responses,
  });
}
