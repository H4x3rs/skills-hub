import { Command } from 'commander';

const helpCommand = new Command('help');
helpCommand
  .description('Show help information')
  .action(async () => {
    console.log('BotSkill Manager (skm) - CLI Tool');
    console.log('');
    console.log('Usage: skm [options] [command]');
    console.log('');
    console.log('Options:');
    console.log('  -V, --version   output the version number');
    console.log('  -h, --help      display help for command');
    console.log('');
    console.log('Commands:');
    console.log('  init [options]     Initialize a new skill project');
    console.log('  login [options]    Login to BotSkill platform');
    console.log('  config [options]   Manage CLI configuration');
    console.log('  get <skill-id>     Download a skill from BotSkill');
    console.log('  push [options]     Upload/push a skill to BotSkill');
    console.log('  list [options]     List skills from BotSkill');
    console.log('  help [command]     display help for command');
    console.log('');
    console.log('Examples:');
    console.log('  skm init --name my-skill');
    console.log('  skm login --token abc123');
    console.log('  skm list --category ai');
    console.log('  skm get gpt-translator');
    console.log('  skm push --public');
    console.log('');
    console.log('For detailed help on any command, use: skm [command] --help');
  });

export { helpCommand };