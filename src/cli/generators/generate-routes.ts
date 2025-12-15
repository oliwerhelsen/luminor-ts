import chalk from "chalk";
import {
  validateName,
  toKebabCase,
  getTargetPath,
  writeFile,
  promptForModule,
} from "./utils.js";

export async function generateRoutes(name: string | undefined): Promise<void> {
  name = validateName(name);
  const moduleName = await promptForModule();

  const fileName = `${name}.routes.ts`;
  const routePath = toKebabCase(name);

  const content = `import { Hono } from 'hono';
import { Container } from 'brewy';
// Import your use cases and DTOs here
// Example:
// import { CreateUserUseCase } from '../application/use-cases/create-user.use-case.js';
// import { CreateUserDto } from '../application/dtos/create-user.dto.js';
// import { validateJson } from 'brewy';

/**
 * ${name} Routes
 * 
 * Following Hono best practices, handlers are defined inline to enable proper
 * type inference for path parameters. This avoids the RoR-like controller pattern
 * where path parameters cannot be inferred correctly.
 */
export const ${name}Routes = new Hono();

// GET /${routePath}
${name}Routes.get('/', async (c) => {
  try {
    // Get use case from container
    // const useCase = Container.get<ListUsersUseCase>('ListUsersUseCase');
    
    // Execute use case
    // const result = await useCase.execute({});
    
    return c.json({ message: 'Not implemented' });
  } catch (error) {
    throw error;
  }
});

// GET /${routePath}/:id
${name}Routes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    // Get use case from container
    // const useCase = Container.get<GetUserUseCase>('GetUserUseCase');
    
    // Execute use case
    // const result = await useCase.execute({ id });
    
    return c.json({ id, message: 'Not implemented' });
  } catch (error) {
    throw error;
  }
});

// POST /${routePath}
${name}Routes.post('/', async (c) => {
  try {
    // Use validation middleware
    // ${name}Routes.post('/', validateJson(CreateUserDto), async (c) => {
    
    const body = await c.req.json();
    
    // Get use case from container
    // const useCase = Container.get<CreateUserUseCase>('CreateUserUseCase');
    
    // Execute use case
    // const result = await useCase.execute(body);
    
    return c.json({ message: 'Not implemented' }, 201);
  } catch (error) {
    throw error;
  }
});

// PUT /${routePath}/:id
${name}Routes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    // Implement update logic
    
    return c.json({ id, message: 'Not implemented' });
  } catch (error) {
    throw error;
  }
});

// DELETE /${routePath}/:id
${name}Routes.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    // Implement delete logic
    
    return c.json({ message: 'Deleted' });
  } catch (error) {
    throw error;
  }
});
`;

  const filePath = getTargetPath("presentation", "routes", fileName, moduleName);
  await writeFile(filePath, content);

  console.log(chalk.cyan("\nNext steps:"));
  console.log(chalk.white(`  1. Import and inject use cases`));
  console.log(chalk.white(`  2. Add validation middleware with DTOs`));
  console.log(chalk.white(`  3. Mount routes in your main app:`));
  console.log(chalk.gray(`     app.route('/api/${routePath}', ${name}Routes)`));
}
