import chalk from "chalk";
import {
  validateName,
  toPascalCase,
  getTargetPath,
  writeFile,
  promptForModule,
} from "./utils.js";

export async function generateRepository(name: string | undefined): Promise<void> {
  name = validateName(name);
  const moduleName = await promptForModule();

  const className = toPascalCase(name);
  const interfaceFileName = `${name}.repository.ts`;
  const implFileName = `${name}.repository.impl.ts`;

  const interfaceContent = `import type { Repository } from 'brewy';
import type { ${className} } from '../domain/entities/${name}.entity.js';

export interface ${className}Repository extends Repository<${className}> {
  findById(id: string): Promise<${className} | null>;
  findAll(): Promise<${className}[]>;
  save(entity: ${className}): Promise<void>;
  delete(id: string): Promise<void>;
  
  // Add custom methods here
  // Example:
  // findByEmail(email: string): Promise<${className} | null>;
}
`;

  const implContent = `import { injectable } from 'tsyringe';
import type { ${className}Repository } from '../domain/repositories/${name}.repository.js';
import type { ${className} } from '../domain/entities/${name}.entity.js';
import { DatabaseException } from 'brewy';

@injectable()
export class ${className}RepositoryImpl implements ${className}Repository {
  constructor() {
    // Inject database or ORM here
    // Example: @inject('Database') private db: Database
  }

  async findById(id: string): Promise<${className} | null> {
    try {
      // Implement database query
      throw new Error('Not implemented');
    } catch (error) {
      throw new DatabaseException('Failed to find ${name}', 'findById', error as Error);
    }
  }

  async findAll(): Promise<${className}[]> {
    try {
      // Implement database query
      throw new Error('Not implemented');
    } catch (error) {
      throw new DatabaseException('Failed to find all ${name}s', 'findAll', error as Error);
    }
  }

  async save(entity: ${className}): Promise<void> {
    try {
      // Implement database insert/update
      throw new Error('Not implemented');
    } catch (error) {
      throw new DatabaseException('Failed to save ${name}', 'save', error as Error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Implement database delete
      throw new Error('Not implemented');
    } catch (error) {
      throw new DatabaseException('Failed to delete ${name}', 'delete', error as Error);
    }
  }
}
`;

  const interfacePath = getTargetPath("domain", "repositories", interfaceFileName, moduleName);
  const implPath = getTargetPath("infrastructure", "repositories", implFileName, moduleName);

  await writeFile(interfacePath, interfaceContent);
  await writeFile(implPath, implContent);

  console.log(chalk.cyan("\nNext steps:"));
  console.log(chalk.white(`  1. Implement repository methods in ${implFileName}`));
  console.log(chalk.white(`  2. Register repository in DI container`));
  console.log(chalk.white(`  3. Inject repository into use cases`));
}
