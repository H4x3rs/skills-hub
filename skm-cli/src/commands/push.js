import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import { getToken } from '../lib/auth.js';
import { uploadSkillFile, findUploadFile, validCategories } from '../lib/uploadSkill.js';

const pushCommand = new Command('push');
pushCommand
  .description('Upload/push a skill to SkillsHub (SKILL.md, .zip, or .tar.gz)')
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
      console.log('[DRY RUN] Would upload:', path.resolve(filePath));
      return;
    }

    console.log(`Pushing skill from ${path.basename(filePath)}...`);
    try {
      const skill = await uploadSkillFile(filePath);
      console.log('Skill uploaded successfully!');
      console.log(`Name: ${skill?.name}`);
      console.log(`Version: ${skill?.version || (skill?.versions?.[0]?.version)}`);
      console.log(`Status: ${skill?.status || 'pending_review'}`);
    } catch (err) {
      if (err.message === 'NOT_LOGGED_IN') {
        console.error('Not logged in. Run: skm login');
      } else if (err.message === 'FILE_NOT_FOUND') {
        console.error('File not found');
      } else {
        const msg = err.response?.data?.error || err.response?.data?.details?.[0] || err.message || 'Upload failed';
        if (err.response?.status === 401) {
          console.error('Token expired or invalid. Run: skm login');
        } else {
          console.error('Upload failed:', msg);
        }
      }
      process.exit(1);
    }
  });

export { pushCommand };
