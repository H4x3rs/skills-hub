#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { loginCommand } from './commands/login.js';
import { configCommand } from './commands/config.js';
import { getCommand } from './commands/get.js';
import { pushCommand } from './commands/push.js';
import { listCommand } from './commands/list.js';
import { helpCommand } from './commands/help.js';

const program = new Command();

program
  .name('skm')
  .description('CLI tool for managing SkillsHub - a platform for AI agent skills')
  .version('1.0.0');

// Add commands
program.addCommand(initCommand);
program.addCommand(loginCommand);
program.addCommand(configCommand);
program.addCommand(getCommand);
program.addCommand(pushCommand);
program.addCommand(listCommand);
program.addCommand(helpCommand);

program.parse();