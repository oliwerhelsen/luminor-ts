import { Hono } from "hono";
import { requireAuth, type AuthContext } from "brewy";
import { auth } from "../auth.js";

const profileRouter = new Hono();

// All routes require authentication
profileRouter.use("*", requireAuth(auth));

// Get current user profile
profileRouter.get("/", async (c: AuthContext) => {
  const user = c.get("user")!;
  const session = c.get("session")!;

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
    session: {
      id: session.id,
      expiresAt: session.expiresAt,
    },
  });
});

export { profileRouter };
