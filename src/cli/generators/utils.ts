import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";

export interface GeneratorOptions {
  name: string;
  moduleName?: string;
}

/**
 * Convert a name to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

/**
 * Convert a name to camelCase
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert a name to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Prompt for module name if in module-based structure
 */
export async function promptForModule(required: boolean = false): Promise<string | undefined> {
  const modulesPath = path.join(process.cwd(), "src", "modules");
  const hasModules = await fs.pathExists(modulesPath);

  if (!hasModules && !required) {
    return undefined;
  }

  let modules: string[] = [];
  if (hasModules) {
    const entries = await fs.readdir(modulesPath, { withFileTypes: true });
    modules = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  }

  if (modules.length === 0 && !required) {
    return undefined;
  }

  const { moduleName } = await inquirer.prompt([
    {
      type: "list",
      name: "moduleName",
      message: "Select module:",
      choices: [
        ...modules,
        new inquirer.Separator(),
        { name: "Create new module", value: "__new__" },
      ],
    },
  ]);

  if (moduleName === "__new__") {
    const { newModuleName } = await inquirer.prompt([
      {
        type: "input",
        name: "newModuleName",
        message: "New module name:",
        validate: (input: string) => {
          if (!input.trim()) return "Module name cannot be empty";
          if (!/^[a-z0-9-]+$/.test(input))
            return "Module name can only contain lowercase letters, numbers, and hyphens";
          return true;
        },
      },
    ]);
    return newModuleName;
  }

  return moduleName;
}

/**
 * Get the target path for a file
 */
export function getTargetPath(
  layer: "domain" | "application" | "infrastructure" | "presentation",
  subDir: string,
  fileName: string,
  moduleName?: string
): string {
  if (moduleName) {
    return path.join(process.cwd(), "src", "modules", moduleName, layer, subDir, fileName);
  }
  return path.join(process.cwd(), "src", layer, subDir, fileName);
}

/**
 * Ensure directory exists
 */
export async function ensureDir(filePath: string): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
}

/**
 * Write file with confirmation
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  if (await fs.pathExists(filePath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: `File ${path.relative(process.cwd(), filePath)} already exists. Overwrite?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.yellow("Skipped."));
      return;
    }
  }

  await ensureDir(filePath);
  await fs.writeFile(filePath, content, "utf-8");
  console.log(chalk.green(`✓ Created ${path.relative(process.cwd(), filePath)}`));
}

/**
 * Validate name input
 */
export function validateName(name: string | undefined): string {
  if (!name || !name.trim()) {
    console.log(chalk.red("Error: Name is required"));
    process.exit(1);
  }
  return name;
}
