import { Hono } from 'hono';
import { Container } from '../core/container.js';

export interface TestContext {
  app: Hono;
  container: typeof Container;
}

export function createTestApp(): TestContext {
  const app = new Hono();
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

