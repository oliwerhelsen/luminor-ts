import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import type { Env } from 'hono';

export interface OpenAPIConfig {
  title: string;
  version: string;
  description?: string;
  docsPath?: string;
}

/**
 * Create an OpenAPI-enabled Hono app with Scalar documentation UI
 * @param config - OpenAPI configuration
 * @returns OpenAPI-enabled Hono app
 */
export function createOpenAPIApp<E extends Env = Env>(config: OpenAPIConfig): OpenAPIHono<E> {
  const app = new OpenAPIHono<E>();

  // Configure OpenAPI metadata
  app.doc('/openapi.json', {
    openapi: '3.0.0',
    info: {
      title: config.title,
      version: config.version,
      ...(config.description && { description: config.description }),
    },
  });

  // Mount Scalar API documentation UI
  const docsPath = config.docsPath || '/api-docs';
  app.get(
    docsPath,
    apiReference({
      spec: {
        url: '/openapi.json',
      },
      theme: 'purple',
    })
  );

  return app;
}
