import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { PoolQuotaConfig, PublicPoolQuotaConfig } from './types.ts';

export const DEFAULT_BOARD_URL = 'http://127.0.0.1:18380';

export const DEFAULT_CONFIG: PoolQuotaConfig = {
  url: DEFAULT_BOARD_URL,
  passcode: '',
  showAis: true,
  compactQuota: true,
};

export const normalizeBoardUrl = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return DEFAULT_BOARD_URL;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Board URL must start with http:// or https://');
    }
    return parsed.origin + parsed.pathname.replace(/\/+$/, '');
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Invalid board URL');
  }
};

export const sharedConfigPath = (): string => (
  path.join(os.homedir(), '.config', 'opencode', 'pool-quota.json')
);

export const serviceDataConfigPath = (env: NodeJS.ProcessEnv = process.env): string | null => {
  const dir = env.OPENCHAMBER_SERVICE_DATA_DIR?.trim();
  return dir ? path.join(dir, 'config.json') : null;
};

type RawConfigFile = Partial<{
  url: unknown;
  passcode: unknown;
  showAis: unknown;
  compactQuota: unknown;
}>;

const readJsonFileSafe = (filePath: string): { data: RawConfigFile; mtimeMs: number } | null => {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return null;
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return { data: parsed as RawConfigFile, mtimeMs: stat.mtimeMs };
  } catch {
    return null;
  }
};

const parseBool = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.trim().toLowerCase();
    if (lower === '1' || lower === 'true' || lower === 'yes' || lower === 'on') return true;
    if (lower === '0' || lower === 'false' || lower === 'no' || lower === 'off') return false;
  }
  return undefined;
};

export const loadConfig = (env: NodeJS.ProcessEnv = process.env): PoolQuotaConfig => {
  const sharedPath = sharedConfigPath();
  const dataPath = serviceDataConfigPath(env);

  const shared = readJsonFileSafe(sharedPath);
  const service = dataPath && dataPath !== sharedPath ? readJsonFileSafe(dataPath) : null;

  // Pick the newer file as primary so edits from either OpenChamber or OpenCode TUI win immediately.
  const ordered: RawConfigFile[] = [];
  if (shared && service) {
    if (shared.mtimeMs >= service.mtimeMs) {
      ordered.push(service.data, shared.data);
    } else {
      ordered.push(shared.data, service.data);
    }
  } else if (shared) {
    ordered.push(shared.data);
  } else if (service) {
    ordered.push(service.data);
  }

  let url = DEFAULT_CONFIG.url;
  let passcode = DEFAULT_CONFIG.passcode;
  let showAis = DEFAULT_CONFIG.showAis;
  let compactQuota = DEFAULT_CONFIG.compactQuota;

  for (const item of ordered) {
    if (typeof item.url === 'string' && item.url.trim()) {
      try {
        url = normalizeBoardUrl(item.url);
      } catch {
        // Keep previous valid URL
      }
    }
    if (typeof item.passcode === 'string') {
      passcode = item.passcode;
    }
    const boolVal = parseBool(item.showAis);
    if (boolVal !== undefined) {
      showAis = boolVal;
    }
    const compactVal = parseBool(item.compactQuota);
    if (compactVal !== undefined) {
      compactQuota = compactVal;
    }
  }

  // Optional environment overrides
  if (typeof env.POOL_QUOTA_URL === 'string' && env.POOL_QUOTA_URL.trim()) {
    try {
      url = normalizeBoardUrl(env.POOL_QUOTA_URL);
    } catch {
      // Ignore malformed env URL
    }
  }
  if (typeof env.POOL_QUOTA_PASSCODE === 'string' && env.POOL_QUOTA_PASSCODE.length > 0) {
    passcode = env.POOL_QUOTA_PASSCODE;
  }
  const envShowAis = parseBool(env.POOL_QUOTA_SHOW_AIS);
  if (envShowAis !== undefined) {
    showAis = envShowAis;
  }
  const envCompact = parseBool(env.POOL_QUOTA_COMPACT);
  if (envCompact !== undefined) {
    compactQuota = envCompact;
  }

  return { url, passcode, showAis, compactQuota };
};

const writeFileSecure = (filePath: string, content: string): void => {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpPath, content, { encoding: 'utf8', mode: 0o600 });
  fs.chmodSync(tmpPath, 0o600);
  fs.renameSync(tmpPath, filePath);
};

export const saveConfig = (
  patch: Partial<{ url: string; passcode: string; showAis: boolean; compactQuota: boolean; clearPasscode: boolean }>,
  env: NodeJS.ProcessEnv = process.env,
): PoolQuotaConfig => {
  const current = loadConfig(env);
  const nextUrl = patch.url !== undefined ? normalizeBoardUrl(patch.url) : current.url;
  let nextPasscode = current.passcode;
  if (patch.clearPasscode === true) {
    nextPasscode = '';
  } else if (typeof patch.passcode === 'string' && patch.passcode.length > 0) {
    nextPasscode = patch.passcode;
  }
  const nextShowAis = typeof patch.showAis === 'boolean' ? patch.showAis : current.showAis;
  const nextCompactQuota = typeof patch.compactQuota === 'boolean' ? patch.compactQuota : current.compactQuota;

  const next: PoolQuotaConfig = {
    url: nextUrl,
    passcode: nextPasscode,
    showAis: nextShowAis,
    compactQuota: nextCompactQuota,
  };
  const payload = `${JSON.stringify(next, null, 2)}\n`;

  const targets = new Set<string>([sharedConfigPath()]);
  const dataPath = serviceDataConfigPath(env);
  if (dataPath) targets.add(dataPath);

  let wroteAny = false;
  let lastError: unknown = null;
  for (const target of targets) {
    try {
      writeFileSecure(target, payload);
      wroteAny = true;
    } catch (err) {
      lastError = err;
    }
  }
  if (!wroteAny && lastError) {
    throw lastError;
  }
  return next;
};

export const toPublicConfig = (cfg: PoolQuotaConfig): PublicPoolQuotaConfig => ({
  url: cfg.url,
  hasPasscode: cfg.passcode.length > 0,
  showAis: cfg.showAis,
  compactQuota: cfg.compactQuota,
});
