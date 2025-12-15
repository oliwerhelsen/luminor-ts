import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { validateName, toKebabCase } from "./utils.js";

export async function generateModule(name: string | undefined): Promise<void> {
  name = validateName(name);
  const moduleName = toKebabCase(name);

  const modulePath = path.join(process.cwd(), "src", "modules", moduleName);

  // Check if module already exists
  if (await fs.pathExists(modulePath)) {
    console.log(chalk.red(`Module ${moduleName} already exists!`));
    process.exit(1);
  }

  // Create module structure
  const dirs = [
    "domain/entities",
    "domain/value-objects",
    "domain/repositories",
    "application/use-cases",
    "application/dtos",
    "infrastructure/repositories",
    "presentation/routes",
  ];

  for (const dir of dirs) {
    const dirPath = path.join(modulePath, dir);
    await fs.ensureDir(dirPath);
    
    // Create .gitkeep files to ensure empty directories are tracked
    await fs.writeFile(path.join(dirPath, ".gitkeep"), "");
  }

  // Create README.md
  const readme = `# ${moduleName} Module

This module follows DDD principles with the following structure:

## Domain Layer
- \`domain/entities/\` - Domain entities
- \`domain/value-objects/\` - Value objects
- \`domain/repositories/\` - Repository interfaces

## Application Layer
- \`application/use-cases/\` - Use cases (application logic)
- \`application/dtos/\` - Data Transfer Objects (Zod schemas)

## Infrastructure Layer
- \`infrastructure/repositories/\` - Repository implementations

## Presentation Layer
- \`presentation/routes/\` - HTTP routes with inline handlers

## Usage

Generate components using the CLI:

\`\`\`bash
brewy generate:entity <name>
brewy generate:value-object <name>
brewy generate:repository <name>
brewy generate:use-case <name>
brewy generate:routes <name>
brewy generate:dto <name>
\`\`\`
`;

  await fs.writeFile(path.join(modulePath, "README.md"), readme);

  console.log(chalk.green(`✓ Created module: ${moduleName}`));
  console.log(chalk.cyan("\nModule structure:"));
  console.log(chalk.white(`  src/modules/${moduleName}/`));
  console.log(chalk.gray(`    ├── domain/`));
  console.log(chalk.gray(`    │   ├── entities/`));
  console.log(chalk.gray(`    │   ├── value-objects/`));
  console.log(chalk.gray(`    │   └── repositories/`));
  console.log(chalk.gray(`    ├── application/`));
  console.log(chalk.gray(`    │   ├── use-cases/`));
  console.log(chalk.gray(`    │   └── dtos/`));
  console.log(chalk.gray(`    ├── infrastructure/`));
  console.log(chalk.gray(`    │   └── repositories/`));
  console.log(chalk.gray(`    └── presentation/`));
  console.log(chalk.gray(`        └── routes/`));

  console.log(chalk.cyan("\nNext steps:"));
  console.log(chalk.white(`  1. Generate entities: brewy g entity <name>`));
  console.log(chalk.white(`  2. Generate use cases: brewy g use-case <name>`));
  console.log(chalk.white(`  3. Generate routes: brewy g routes <name>`));
}
