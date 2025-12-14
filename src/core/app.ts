import { Hono } from 'hono';
import { Container } from './container.js';
import type { Context, Env } from 'hono';

export interface AppOptions {
  errorHandler?: (error: Error, c: Context) => Response | Promise<Response>;
  notFoundHandler?: (c: Context) => Response | Promise<Response>;
}

export class AppFactory {
  static create<E extends Env = Env>(options?: AppOptions): Hono<E> {
    const app = new Hono<E>();

    // Error handling middleware
    app.onError((error, c) => {
      console.error('Error:', error);
      
      if (options?.errorHandler) {
        return options.errorHandler(error, c);
      }

      return c.json(
        {
          error: {
            message: error.message || 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
          },
        },
        500
      );
    });

    // Not found handler
    app.notFound((c) => {
      if (options?.notFoundHandler) {
        return options.notFoundHandler(c);
      }

      return c.json({ error: { message: 'Not Found' } }, 404);
    });

    // DI context injection middleware
    app.use('*', async (c, next) => {
      // Inject Hono context into DI container for this request
      Container.registerInstance('HonoContext', c);
      await next();
    });

    return app;
  }
}

