import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type DatabaseType = 'sqlite' | 'postgresql' | 'mysql';
export type ProjectType = 'empty' | 'full-example';

interface ProjectConfig {
  projectName: string;
  databaseType: DatabaseType;
  projectType: ProjectType;
}

export async function createApp(projectName?: string): Promise<void> {
  console.log(chalk.blue.bold('\n🚀 Luminor - Enterprise Hono Framework\n'));

  const config = await promptForConfig(projectName);

  const targetPath = path.resolve(process.cwd(), config.projectName);

  if (await fs.pathExists(targetPath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Directory ${config.projectName} already exists. Overwrite?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.yellow('Operation cancelled.'));
      return;
    }

    await fs.remove(targetPath);
  }

  console.log(chalk.green(`\n📦 Creating project: ${config.projectName}...`));

  // Copy template
  const templatePath = path.join(__dirname, '../../templates', config.projectType);
  await fs.copy(templatePath, targetPath);

  // Replace placeholders
  await replacePlaceholders(targetPath, config);

  // Install dependencies
  console.log(chalk.green('\n📥 Installing dependencies...'));
  process.chdir(targetPath);
  execSync('npm install', { stdio: 'inherit' });

  console.log(chalk.green.bold(`\n✅ Project ${config.projectName} created successfully!`));
  console.log(chalk.cyan(`\nNext steps:`));
  console.log(chalk.white(`  cd ${config.projectName}`));
  console.log(chalk.white(`  npm run dev`));
}

async function promptForConfig(projectName?: string): Promise<ProjectConfig> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: projectName || 'my-luminor-app',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Project name cannot be empty';
        }
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Project name can only contain lowercase letters, numbers, and hyphens';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'databaseType',
      message: 'Select database:',
      choices: [
        { name: 'SQLite (default)', value: 'sqlite' },
        { name: 'PostgreSQL', value: 'postgresql' },
        { name: 'MySQL', value: 'mysql' },
      ],
      default: 'sqlite',
    },
    {
      type: 'list',
      name: 'projectType',
      message: 'Select project type:',
      choices: [
        { name: 'Empty project', value: 'empty' },
        { name: 'Full example', value: 'full-example' },
      ],
      default: 'empty',
    },
  ]);

  return {
    projectName: answers.projectName,
    databaseType: answers.databaseType,
    projectType: answers.projectType,
  };
}

async function replacePlaceholders(
  targetPath: string,
  config: ProjectConfig
): Promise<void> {
  const files = await glob('**/*', {
    cwd: targetPath,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.git/**'],
    nodir: true,
  });

  const replacements: Record<string, string> = {
    '{{PROJECT_NAME}}': config.projectName,
    '{{DATABASE_TYPE}}': config.databaseType,
    '{{DATABASE_DRIVER}}': getDatabaseDriver(config.databaseType),
    '{{DATABASE_PACKAGE}}': getDatabasePackage(config.databaseType),
    '{{DRIZZLE_IMPORT}}': getDrizzleImport(config.databaseType),
  };

  for (const file of files) {
    let content = await fs.readFile(file, 'utf-8');

    for (const [placeholder, value] of Object.entries(replacements)) {
      content = content.replace(new RegExp(placeholder, 'g'), value);
    }

    await fs.writeFile(file, content, 'utf-8');
  }
}

function getDatabaseDriver(dbType: DatabaseType): string {
  switch (dbType) {
    case 'sqlite':
      return 'better-sqlite3';
    case 'postgresql':
      return 'pg';
    case 'mysql':
      return 'mysql2';
  }
}

function getDatabasePackage(dbType: DatabaseType): string {
  switch (dbType) {
    case 'sqlite':
      return 'better-sqlite3';
    case 'postgresql':
      return 'pg';
    case 'mysql':
      return 'mysql2';
  }
}

function getDrizzleImport(dbType: DatabaseType): string {
  switch (dbType) {
    case 'sqlite':
      return "import { drizzle } from 'drizzle-orm/better-sqlite3';";
    case 'postgresql':
      return "import { drizzle } from 'drizzle-orm/node-postgres';";
    case 'mysql':
      return "import { drizzle } from 'drizzle-orm/mysql2';";
  }
}

