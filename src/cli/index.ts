#!/usr/bin/env node

import { createApp } from './create-app.js';

const args = process.argv.slice(2);
const command = args[0];
const projectName = args[1];

if (command === 'create-app') {
  createApp(projectName).catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
} else {
  console.log('Usage: luminor create-app [project-name]');
  process.exit(1);
}

