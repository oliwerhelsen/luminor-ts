import chalk from "chalk";
import {
  validateName,
  toCamelCase,
  getTargetPath,
  writeFile,
} from "./utils.js";

export async function generateMiddleware(name: string | undefined): Promise<void> {
  name = validateName(name);

  const functionName = toCamelCase(name);
  const fileName = `${name}.middleware.ts`;

  const content = `import type { Context, MiddlewareHandler } from 'hono';

export interface ${functionName}Options {
  // Add configuration options here
  // Example:
  // enabled?: boolean;
}

/**
 * ${name} middleware
 * TODO: Add description
 */
export function ${functionName}Middleware(options?: ${functionName}Options): MiddlewareHandler {
  return async (c: Context, next) => {
    // Implement middleware logic
    // Example:
    // console.log('Before request');
    
    await next();
    
    // Example:
    // console.log('After request');
  };
}
`;

  const filePath = getTargetPath("infrastructure", "middleware", fileName);
  await writeFile(filePath, content);

  console.log(chalk.cyan("\nNext steps:"));
  console.log(chalk.white(`  1. Implement middleware logic`));
  console.log(chalk.white(`  2. Export from src/index.ts if it's a common middleware`));
  console.log(chalk.white(`  3. Use in your app:`));
  console.log(chalk.gray(`     app.use('*', ${functionName}Middleware())`));
}
