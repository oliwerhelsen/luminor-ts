import chalk from "chalk";
import {
  validateName,
  toPascalCase,
  getTargetPath,
  writeFile,
  promptForModule,
} from "./utils.js";

export async function generateUseCase(name: string | undefined): Promise<void> {
  name = validateName(name);
  const moduleName = await promptForModule();

  const className = toPascalCase(name);
  const fileName = `${name}.use-case.ts`;

  const content = `import { injectable } from 'tsyringe';
import type { UseCase } from 'brewy';
import { UseCaseException } from 'brewy';

export interface ${className}Input {
  // Define input parameters
  // Example:
  // userId: string;
}

export interface ${className}Output {
  // Define output data
  // Example:
  // success: boolean;
  // data: any;
}

@injectable()
export class ${className}UseCase implements UseCase<${className}Input, ${className}Output> {
  constructor(
    // Inject dependencies here
    // Example: @inject('UserRepository') private userRepository: UserRepository
  ) {}

  async execute(input: ${className}Input): Promise<${className}Output> {
    // Implement use case logic
    // Example:
    // const user = await this.userRepository.findById(input.userId);
    // if (!user) {
    //   throw new EntityNotFoundException('User', input.userId);
    // }

    throw new UseCaseException('Not implemented', '${className}UseCase');
  }
}
`;

  const filePath = getTargetPath("application", "use-cases", fileName, moduleName);
  await writeFile(filePath, content);

  console.log(chalk.cyan("\nNext steps:"));
  console.log(chalk.white(`  1. Define input and output types`));
  console.log(chalk.white(`  2. Inject required repositories/services`));
  console.log(chalk.white(`  3. Implement the execute() method`));
  console.log(chalk.white(`  4. Use in routes`));
}
