import { Hono } from "hono";
import { betterAuthMiddleware, requireAuth, type AuthContext } from "brewy";
import { auth } from "../auth.js";

// Simple in-memory storage for demo
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

const posts: Post[] = [];

const postsRouter = new Hono();

// Add session to all routes
postsRouter.use("*", betterAuthMiddleware(auth));

// Public: List all posts
postsRouter.get("/", async (c: AuthContext) => {
  return c.json({ posts });
});

// Public: Get single post
postsRouter.get("/:id", async (c: AuthContext) => {
  const id = c.req.param("id");
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json({ post });
});

// Protected: Create a new post
postsRouter.post("/", requireAuth(auth), async (c: AuthContext) => {
  const user = c.get("user")!; // Guaranteed by requireAuth
  const body = await c.req.json<{ title: string; content: string }>();

  if (!body.title || !body.content) {
    return c.json({ error: "Title and content are required" }, 400);
  }

  const newPost: Post = {
    id: crypto.randomUUID(),
    title: body.title,
    content: body.content,
    authorId: user.id,
    authorName: user.name,
    createdAt: new Date(),
  };

  posts.push(newPost);

  return c.json({ post: newPost }, 201);
});

// Protected: Delete a post (only your own)
postsRouter.delete("/:id", requireAuth(auth), async (c: AuthContext) => {
  const user = c.get("user")!;
  const id = c.req.param("id");

  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return c.json({ error: "Post not found" }, 404);
  }

  // Check ownership
  if (posts[postIndex].authorId !== user.id) {
    return c.json({ error: "You can only delete your own posts" }, 403);
  }

  const deletedPost = posts.splice(postIndex, 1)[0];

  return c.json({ message: "Post deleted", post: deletedPost });
});

export { postsRouter };
