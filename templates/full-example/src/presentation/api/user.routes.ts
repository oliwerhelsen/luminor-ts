import { authMiddleware, Container } from "brewy";
import { Hono } from "hono";
import { CreateUserUseCase } from "../../application/use-cases/create-user.use-case.js";
import { GetUserUseCase } from "../../application/use-cases/get-user.use-case.js";
import { ListUsersUseCase } from "../../application/use-cases/list-users.use-case.js";
import { UserRepository } from "../../infrastructure/repositories/user.repository.js";

// Register dependencies
Container.register("UserRepository", () => new UserRepository());
Container.register("CreateUserUseCase", () => {
  const repo = Container.get<UserRepository>("UserRepository");
  return new CreateUserUseCase(repo);
});
Container.register("GetUserUseCase", () => {
  const repo = Container.get<UserRepository>("UserRepository");
  return new GetUserUseCase(repo);
});
Container.register("ListUsersUseCase", () => {
  const repo = Container.get<UserRepository>("UserRepository");
  return new ListUsersUseCase(repo);
});

const userRoutes = new Hono();

// Public route - create user
userRoutes.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const createUserUseCase =
      Container.get<CreateUserUseCase>("CreateUserUseCase");
    const user = await createUserUseCase.execute(body);

    return c.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      201
    );
  } catch (error: any) {
    return c.json({ error: { message: error.message } }, 400);
  }
});

// Protected routes
userRoutes.use("*", authMiddleware());

userRoutes.get("/", async (c) => {
  try {
    const listUsersUseCase =
      Container.get<ListUsersUseCase>("ListUsersUseCase");
    const users = await listUsersUseCase.execute();

    return c.json(
      users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }))
    );
  } catch (error: any) {
    return c.json({ error: { message: error.message } }, 500);
  }
});

userRoutes.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const getUserUseCase = Container.get<GetUserUseCase>("GetUserUseCase");
    const user = await getUserUseCase.execute(id);

    return c.json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error: any) {
    if (error.message === "User not found") {
      return c.json({ error: { message: error.message } }, 404);
    }
    return c.json({ error: { message: error.message } }, 500);
  }
});

export { userRoutes };
