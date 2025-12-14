import chalk from "chalk";
import {
  validateName,
  toPascalCase,
  getTargetPath,
  writeFile,
  promptForModule,
} from "./utils.js";

export async function generateDto(name: string | undefined): Promise<void> {
  name = validateName(name);
  const moduleName = await promptForModule();

  const className = toPascalCase(name);
  const fileName = `${name}.dto.ts`;

  const content = `import { z } from 'zod';

export const ${className}Dto = z.object({
  // Add your fields here
  // Example:
  // name: z.string().min(1),
  // email: z.string().email(),
  // age: z.number().int().positive().optional(),
});

export type ${className}Dto = z.infer<typeof ${className}Dto>;
`;

  const filePath = getTargetPath("application", "dtos", fileName, moduleName);
  await writeFile(filePath, content);

  console.log(chalk.cyan("\nNext steps:"));
  console.log(chalk.white(`  1. Define your DTO fields in ${fileName}`));
  console.log(chalk.white(`  2. Use it with validateJson(${className}Dto) in your routes`));
}
