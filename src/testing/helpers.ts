import { Hono } from 'hono';
import type { Env } from 'hono';
import { Container } from '../core/container.js';

export interface TestContext {
  app: Hono<Env>;
  container: typeof Container;
}

export function createTestApp<E extends Env = Env>(): TestContext {
  const app = new Hono<E>();
  Container.reset();

  return {
    app,
    container: Container,
  };
}

export function mockRequest(
  app: Hono,
  method: string,
  path: string,
  options?: {
    headers?: Record<string, string>;
    body?: any;
  }
): Request {
  const url = `http://localhost${path}`;
  const init: RequestInit = {
    method,
    headers: options?.headers || {},
  };

  if (options?.body) {
    init.body = JSON.stringify(options.body);
    (init.headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  return new Request(url, init);
}

export async function makeRequest(
  app: Hono,
  request: Request
): Promise<Response> {
  return app.fetch(request);
}

