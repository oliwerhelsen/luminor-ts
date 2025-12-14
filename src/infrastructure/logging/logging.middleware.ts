import type { Context, Next } from 'hono';
import { Container } from '../../core/container.js';
import { Logger } from './logger.js';

export function loggingMiddleware() {
  return async (c: Context, next: Next) => {
    const logger = Container.get<Logger>('Logger');
    const start = Date.now();
    const method = c.req.method;
    const path = c.req.path;

    logger.info('Request started', {
      method,
      path,
      url: c.req.url,
    });

    await next();

    const duration = Date.now() - start;
    const status = c.res.status;

    logger.info('Request completed', {
      method,
      path,
      status,
      duration: `${duration}ms`,
    });
  };
}

