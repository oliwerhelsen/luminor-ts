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
    // Implement database query
    // Example:
    // const result = await this.db.select().from(table).where(eq(table.id, id));
    // return result[0] ? this.toDomain(result[0]) : null;
    
    throw new DatabaseException('Not implemented', 'findById');
  }

  async findAll(): Promise<${className}[]> {
    // Implement database query
    // Example:
    // const results = await this.db.select().from(table);
    // return results.map(r => this.toDomain(r));
    
    throw new DatabaseException('Not implemented', 'findAll');
  }

  async save(entity: ${className}): Promise<void> {
    // Implement database insert/update
    // Example:
    // await this.db.insert(table).values(this.toPersistence(entity));
    
    throw new DatabaseException('Not implemented', 'save');
  }

  async delete(id: string): Promise<void> {
    // Implement database delete
    // Example:
    // await this.db.delete(table).where(eq(table.id, id));
    
    throw new DatabaseException('Not implemented', 'delete');
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
