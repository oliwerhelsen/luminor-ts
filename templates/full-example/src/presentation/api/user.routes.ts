import { Container, requireAuth, validateJson, type AuthContext } from "brewy";
import { Hono } from "hono";
import { CreateUserUseCase } from "../../application/use-cases/create-user.use-case.js";
import { GetUserUseCase } from "../../application/use-cases/get-user.use-case.js";
import { ListUsersUseCase } from "../../application/use-cases/list-users.use-case.js";
import { UserRepository } from "../../infrastructure/repositories/user.repository.js";
import { getAuth } from "../../infrastructure/auth/auth.config.js";
import { CreateUserDto } from "../../application/dto/create-user.dto.js";

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

// Public route - create user (with Zod validation)
userRoutes.post("/", validateJson(CreateUserDto), async (c) => {
  try {
    const body = c.req.valid('json');
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
    // Errors are now handled by ExceptionFilter
    throw error;
  }
});

// Protected routes
const authEnabled = "{{AUTH_ENABLED}}" === "true";
if (authEnabled) {
  const auth = await getAuth();
  userRoutes.use("*", requireAuth(auth));
}

userRoutes.get("/", async (c: AuthContext) => {
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
});

userRoutes.get("/:id", async (c: AuthContext) => {
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
});

export { userRoutes };
