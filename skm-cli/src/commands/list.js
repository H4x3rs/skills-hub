import { Command } from 'commander';

const listCommand = new Command('list');
listCommand
  .alias('ls')
  .description('List skills from SkillsHub')
  .option('-a, --all', 'Show all skills including private ones')
  .option('-p, --public', 'Show only public skills')
  .option('-m, --mine', 'Show only skills owned by current user')
  .option('-c, --category <category>', 'Filter by category')
  .option('-t, --tag <tag>', 'Filter by tag')
  .option('-s, --search <query>', 'Search skills by name or description')
  .option('--limit <number>', 'Maximum number of results (default: 20)')
  .option('--offset <number>', 'Offset for pagination (default: 0)')
  .action(async (options) => {
    console.log('Fetching skills list...');
    
    console.log('Filters:');
    if (options.all) console.log('- Showing all skills');
    if (options.public) console.log('- Showing only public skills');
    if (options.mine) console.log('- Showing only your skills');
    if (options.category) console.log(`- Category: ${options.category}`);
    if (options.tag) console.log(`- Tag: ${options.tag}`);
    if (options.search) console.log(`- Search: ${options.search}`);
    
    // 在实际实现中，这里会从API获取技能列表
    console.log('\nFetching from SkillsHub API...');
    
    // 示例数据
    const sampleSkills = [
      { id: 'gpt-translator', name: 'GPT Translator', version: '1.2.0', downloads: 1250, category: 'ai' },
      { id: 'data-analyzer', name: 'Data Analyzer', version: '2.1.1', downloads: 890, category: 'data' },
      { id: 'web-scraper', name: 'Web Scraper', version: '0.9.5', downloads: 632, category: 'web' },
      { id: 'security-checker', name: 'Security Checker', version: '1.0.3', downloads: 421, category: 'security' }
    ];
    
    console.log(`\nFound ${sampleSkills.length} skills:`);
    console.log('----------------------------------------');
    sampleSkills.forEach(skill => {
      console.log(`${skill.name} (${skill.id})`);
      console.log(`  Version: ${skill.version} | Downloads: ${skill.downloads} | Category: ${skill.category}`);
      console.log('');
    });
    
    console.log('Use "skm get <skill-id>" to download a specific skill');
  });

export { listCommand };