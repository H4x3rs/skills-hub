import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import { getToken } from '../lib/auth.js';
import { uploadSkillFile, findUploadFile } from '../lib/uploadSkill.js';

const publishCommand = new Command('publish');
publishCommand
  .description('Publish a skill to SkillsHub (alias for push)')
  .option('-f, --file <path>', 'Path to SKILL.md, .zip, or .tar.gz')
  .option('--dry-run', 'Validate without uploading')
  .option('--api-url <url>', 'API base URL')
  .action(async (options) => {
    if (!getToken()) {
      console.error('Not logged in. Run: skm login');
      process.exit(1);
    }

    let filePath = options.file;
    if (!filePath) {
      filePath = await findUploadFile();
      if (!filePath) {
        console.error('No skill file found. Create SKILL.md or a .zip/.tar.gz package, or use --file <path>');
        process.exit(1);
      }
    } else {
      if (!await fs.pathExists(filePath)) {
        console.error('File not found:', filePath);
        process.exit(1);
      }
    }

    if (options.dryRun) {
      console.log('[DRY RUN] Would publish:', path.resolve(filePath));
      return;
    }

    console.log(`Publishing skill from ${path.basename(filePath)}...`);
    try {
      const skill = await uploadSkillFile(filePath);
      console.log('Skill published successfully!');
      console.log(`Name: ${skill?.name}`);
      console.log(`Version: ${skill?.version || (skill?.versions?.[0]?.version)}`);
      console.log(`Status: ${skill?.status || 'pending_review'}`);
    } catch (err) {
      if (err.message === 'NOT_LOGGED_IN') {
        console.error('Not logged in. Run: skm login');
      } else if (err.message === 'FILE_NOT_FOUND') {
        console.error('File not found');
      } else {
        const msg = err.response?.data?.error || err.response?.data?.details?.[0] || err.message || 'Publish failed';
        if (err.response?.status === 401) {
          console.error('Token expired or invalid. Run: skm login');
        } else {
          console.error('Publish failed:', msg);
        }
      }
      process.exit(1);
    }
  });

export { publishCommand };
