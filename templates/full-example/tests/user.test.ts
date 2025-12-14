import { createTestApp, makeRequest, mockRequest } from "brewy";
import type { Hono } from "hono";
import { beforeEach, describe, expect, it } from "vitest";

describe("User API", () => {
  let app: Hono;

  beforeEach(() => {
    const testApp = createTestApp();
    app = testApp.app;
    // Add your routes here
  });

  it("should return 200 on GET /", async () => {
    const request = mockRequest(app, "GET", "/");
    const response = await makeRequest(app, request);
    expect(response.status).toBe(200);
  });
});
