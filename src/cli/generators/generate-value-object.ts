import chalk from "chalk";
import {
  validateName,
  toPascalCase,
  getTargetPath,
  writeFile,
  promptForModule,
} from "./utils.js";

export async function generateValueObject(name: string | undefined): Promise<void> {
  name = validateName(name);
  const moduleName = await promptForModule();

  const className = toPascalCase(name);
  const fileName = `${name}.value-object.ts`;

  const content = `import { ValidationException } from 'brewy';

export class ${className} {
  private constructor(private readonly value: string) {
    this.validate(value);
  }

  private validate(value: string): void {
    // Add your validation logic here
    // Example:
    // if (!value.trim()) {
    //   throw new ValidationException('${className} cannot be empty');
    // }
  }

  static create(value: string): ${className} {
    return new ${className}(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ${className}): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
`;

  const filePath = getTargetPath("domain", "value-objects", fileName, moduleName);
  await writeFile(filePath, content);

  console.log(chalk.cyan("\nNext steps:"));
  console.log(chalk.white(`  1. Implement validation logic in the validate() method`));
  console.log(chalk.white(`  2. Add any necessary business rules`));
  console.log(chalk.white(`  3. Use this value object in your entities`));
}
