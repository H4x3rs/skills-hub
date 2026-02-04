import { Command } from 'commander';
import path from 'path';
import AdmZip from 'adm-zip';
import { createApiClient } from '../lib/auth.js';

/**
 * Parse specifier: name@version or name
 * Returns { name, version } for API
 */
function parseSpecifier(spec) {
  const s = spec.trim();
  const atIdx = s.lastIndexOf('@');
  if (atIdx < 0) return { name: s, version: undefined };
  return {
    name: s.slice(0, atIdx).trim(),
    version: s.slice(atIdx + 1).trim() || undefined,
  };
}

const getCommand = new Command('get');
getCommand
  .description('Download a skill from SkillsHub and extract to directory')
  .argument('<specifier>', 'Skill name or name@version (e.g. pdf-parser or pdf-parser@1.0.0)')
  .option('-o, --output <dir>', 'Output directory (default: current directory)')
  .option('--dry-run', 'Show what would be downloaded without actually downloading')
  .action(async (specifier, options) => {
    const { name, version } = parseSpecifier(specifier);
    const outputDir = path.resolve(options.output || process.cwd());

    if (!name) {
      console.error('Error: skill name is required');
      process.exit(1);
    }

    if (options.dryRun) {
      console.log('[DRY RUN] Would download skill:', name);
      console.log('[DRY RUN] Version:', version || 'latest');
      console.log('[DRY RUN] Output:', outputDir);
      return;
    }

    try {
      const api = createApiClient();

      const fullSpec = version ? `${name}@${version}` : name;
      console.log(`Downloading skill: ${fullSpec}`);
      console.log(`Version: ${version || 'latest'}`);
      console.log(`Output: ${outputDir}`);

      const resolveRes = await api.get(`/skills/by-name/${encodeURIComponent(fullSpec)}`);
      const skill = resolveRes.data?.skill ?? resolveRes.data;
      if (!skill?._id) {
        console.error('Download failed: Skill not found');
        process.exit(1);
      }

      const versionParam = version ? `?version=${encodeURIComponent(version)}` : '';
      const url = `/skills/${encodeURIComponent(skill._id)}/download${versionParam}`;
      const res = await api.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(res.data);

      const zip = new AdmZip(buffer);
      zip.extractAllTo(outputDir, true);

      const entries = zip.getEntries();
      const skillDir = entries.find(e => e.isDirectory)?.entryName || entries[0]?.entryName?.split('/')[0] || 'skill';
      const targetPath = path.join(outputDir, skillDir);

      console.log(`\nSkill downloaded successfully!`);
      console.log(`Location: ${targetPath}`);
    } catch (err) {
      let msg = err.message;
      if (err.response?.data) {
        const raw = err.response.data;
        const str = Buffer.isBuffer(raw) ? raw.toString() : (typeof raw === 'string' ? raw : JSON.stringify(raw));
        try {
          const obj = JSON.parse(str);
          msg = obj.error || obj.message || msg;
        } catch (_) {
          msg = str || msg;
        }
      }
      console.error('Download failed:', msg);
      process.exit(1);
    }
  });

export { getCommand };
