import 'reflect-metadata';
import { Hono } from 'hono';
import { AppFactory } from 'luminor';
import { serve } from '@hono/node-server';

const app = AppFactory.create();

app.get('/', (c) => {
  return c.json({ message: 'Hello from Luminor!' });
});

const port = parseInt(process.env.PORT || '3000');
console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

