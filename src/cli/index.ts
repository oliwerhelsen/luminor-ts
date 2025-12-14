#!/usr/bin/env node

import chalk from "chalk";
import { createApp } from "./create-app.js";
import { generateModule } from "./generators/generate-module.js";
import { generateEntity } from "./generators/generate-entity.js";
import { generateValueObject } from "./generators/generate-value-object.js";
import { generateRepository } from "./generators/generate-repository.js";
import { generateUseCase } from "./generators/generate-use-case.js";
import { generateController } from "./generators/generate-controller.js";
import { generateDto } from "./generators/generate-dto.js";
import { generateMiddleware } from "./generators/generate-middleware.js";

const args = process.argv.slice(2);
const command = args[0];
const subCommand = args[1];
const name = args[2];

async function main() {
  if (command === "create-app") {
    await createApp(subCommand);
  } else if (command === "generate" || command === "g") {
    if (!subCommand) {
      showGenerateHelp();
      process.exit(1);
    }

    switch (subCommand) {
      case "module":
        await generateModule(name);
        break;
      case "entity":
        await generateEntity(name);
        break;
      case "value-object":
      case "vo":
        await generateValueObject(name);
        break;
      case "repository":
      case "repo":
        await generateRepository(name);
        break;
      case "use-case":
      case "uc":
        await generateUseCase(name);
        break;
      case "controller":
      case "ctrl":
        await generateController(name);
        break;
      case "dto":
        await generateDto(name);
        break;
      case "middleware":
      case "mw":
        await generateMiddleware(name);
        break;
      default:
        console.log(chalk.red(`Unknown generate command: ${subCommand}`));
        showGenerateHelp();
        process.exit(1);
    }
  } else {
    showHelp();
    process.exit(1);
  }
}

function showHelp() {
  console.log(chalk.blue.bold("\n🚀 brewy - Enterprise Hono Framework\n"));
  console.log(chalk.white("Usage:"));
  console.log(chalk.gray("  brewy create-app [project-name]"));
  console.log(chalk.gray("  brewy generate <type> <name>"));
  console.log(chalk.gray("  brewy g <type> <name>           (shorthand)\n"));
  console.log(chalk.white("Commands:"));
  console.log(chalk.gray("  create-app                      Create a new brewy application"));
  console.log(chalk.gray("  generate, g                     Generate code from templates\n"));
  console.log(chalk.white("For more information, run:"));
  console.log(chalk.gray("  brewy generate --help"));
}

function showGenerateHelp() {
  console.log(chalk.blue.bold("\n🔨 brewy generate - Code generators\n"));
  console.log(chalk.white("Usage:"));
  console.log(chalk.gray("  brewy generate <type> <name>\n"));
  console.log(chalk.white("Available generators:"));
  console.log(chalk.gray("  module                          Generate complete DDD module structure"));
  console.log(chalk.gray("  entity                          Generate domain entity"));
  console.log(chalk.gray("  value-object, vo                Generate domain value object"));
  console.log(chalk.gray("  repository, repo                Generate repository interface + implementation"));
  console.log(chalk.gray("  use-case, uc                    Generate application use case"));
  console.log(chalk.gray("  controller, ctrl                Generate presentation controller"));
  console.log(chalk.gray("  dto                             Generate Zod DTO schema"));
  console.log(chalk.gray("  middleware, mw                  Generate middleware"));
}

main().catch((error) => {
  console.error(chalk.red("Error:"), error.message);
  process.exit(1);
});
