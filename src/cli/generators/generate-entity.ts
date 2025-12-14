import chalk from "chalk";
import {
  validateName,
  toPascalCase,
  getTargetPath,
  writeFile,
  promptForModule,
} from "./utils.js";

export async function generateEntity(name: string | undefined): Promise<void> {
  name = validateName(name);
  const moduleName = await promptForModule();

  const className = toPascalCase(name);
  const fileName = `${name}.entity.ts`;

  const content = `import { BaseEntity } from 'brewy';

export interface ${className}Props {
  // Add your entity properties here
  // Example:
  // name: string;
  // email: string;
}

export class ${className} extends BaseEntity {
  private constructor(
    private readonly props: ${className}Props,
    id?: string
  ) {
    super(id);
  }

  // Getters
  // get name(): string {
  //   return this.props.name;
  // }

  // Factory method
  static create(props: ${className}Props, id?: string): ${className} {
    // Add validation logic here
    return new ${className}(props, id);
  }

  // Business logic methods
  // Example:
  // changeName(newName: string): void {
  //   // Validate
  //   if (!newName.trim()) {
  //     throw new ValidationException('Name cannot be empty');
  //   }
  //   this.props.name = newName;
  //   this.updateTimestamp();
  // }
}
`;

  const filePath = getTargetPath("domain", "entities", fileName, moduleName);
  await writeFile(filePath, content);

  console.log(chalk.cyan("\nNext steps:"));
  console.log(chalk.white(`  1. Define your entity properties in ${className}Props`));
  console.log(chalk.white(`  2. Add getters for your properties`));
  console.log(chalk.white(`  3. Implement business logic methods`));
}
