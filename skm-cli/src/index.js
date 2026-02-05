#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { loginCommand } from './commands/login.js';
import { logoutCommand } from './commands/logout.js';
import { configCommand } from './commands/config.js';
import { getCommand } from './commands/get.js';
import { pushCommand } from './commands/push.js';
import { publishCommand } from './commands/publish.js';
import { listCommand } from './commands/list.js';
import { searchCommand } from './commands/search.js';
import { infoCommand } from './commands/info.js';
import { helpCommand } from './commands/help.js';

const program = new Command();

program
  .name('skm')
  .description('CLI tool for managing BotSkill - a platform for AI agent skills')
  .version('1.0.0');

program.addCommand(initCommand);
program.addCommand(loginCommand);
program.addCommand(logoutCommand);
program.addCommand(configCommand);
program.addCommand(getCommand);
program.addCommand(pushCommand);
program.addCommand(publishCommand);
program.addCommand(listCommand);
program.addCommand(searchCommand);
program.addCommand(infoCommand);
program.addCommand(helpCommand);

program.parse();