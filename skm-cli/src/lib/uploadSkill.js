import path from 'path';
import fs from 'fs-extra';
import { createApiClient, getToken } from './auth.js';

const validCategories = ['ai', 'data', 'web', 'devops', 'security', 'tools'];

/**
 * Find uploadable file in cwd
 * Priority: SKILL.md, skill.zip, skill.tar.gz, dist.zip
 */
export async function findUploadFile(cwd = process.cwd()) {
  const candidates = [
    path.join(cwd, 'SKILL.md'),
    path.join(cwd, 'skill.zip'),
    path.join(cwd, 'skill.tar.gz'),
    path.join(cwd, 'dist.zip'),
  ];
  for (const p of candidates) {
    if (await fs.pathExists(p)) {
      const stat = await fs.stat(p);
      if (stat.isFile()) return p;
    }
  }
  return null;
}

/**
 * Upload skill file (SKILL.md, .zip, .tar.gz) to BotSkill
 * @param {string} filePath - Path to file
 */
export async function uploadSkillFile(filePath) {
  const token = getToken();
  if (!token) {
    throw new Error('NOT_LOGGED_IN');
  }

  if (!await fs.pathExists(filePath)) {
    throw new Error('FILE_NOT_FOUND');
  }

  const FormData = (await import('form-data')).default;
  const form = new FormData();
  form.append('file', await fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  });

  const api = createApiClient();
  const res = await api.post('/skills/upload', form, {
    headers: form.getHeaders(),
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
  return res.data?.skill || res.data;
}

/**
 * Legacy: upload via JSON (for backward compatibility, may be deprecated)
 */
export async function uploadSkill(options = {}) {
  const token = getToken();
  if (!token) throw new Error('NOT_LOGGED_IN');

  let config = {};
  const configPath = path.join(process.cwd(), 'skill.config.json');
  if (await fs.pathExists(configPath)) {
    config = await fs.readJson(configPath);
  }

  const skillData = {
    name: options.name || config.name,
    description: options.description || config.description,
    version: options.version || config.version || '1.0.0',
    category: options.category || config.category || 'tools',
    tags: config.tags || [],
    license: config.license || 'MIT',
    repositoryUrl: config.repositoryUrl || undefined,
    documentationUrl: config.documentationUrl || undefined,
    demoUrl: config.demoUrl || undefined,
  };

  if (!skillData.name || !skillData.description) throw new Error('MISSING_FIELDS');
  if (!validCategories.includes(skillData.category)) {
    throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
  }

  const api = createApiClient();
  const res = await api.post('/skills', skillData);
  return res.data?.skill || res.data;
}

export { validCategories };
