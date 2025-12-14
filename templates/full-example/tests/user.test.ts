import { describe, it, expect, beforeEach } from 'vitest';
import { createTestApp, mockRequest, makeRequest } from 'luminor';
import type { Hono } from 'hono';

describe('User API', () => {
  let app: Hono;

  beforeEach(() => {
    const testApp = createTestApp();
    app = testApp.app;
    // Add your routes here
  });

  it('should return 200 on GET /', async () => {
    const request = mockRequest(app, 'GET', '/');
    const response = await makeRequest(app, request);
    expect(response.status).toBe(200);
  });
});

