import { serve } from "@hono/node-server";
import { AppFactory } from "brewy";
import "reflect-metadata";

const app = AppFactory.create();

app.get("/", (c) => {
  return c.json({ message: "Hello from brewy!" });
});

const port = parseInt(process.env.PORT || "3000");
console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
