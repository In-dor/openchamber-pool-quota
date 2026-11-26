import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { BunPlugin } from 'bun';
import { PANEL_CSS } from '../src/panel/styles.ts';

const root = resolve(import.meta.dir, '..');

export const minifyCss = (css: string): string => css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{};,])\s*/g, '$1')
  .replace(/:\s+/g, ':')
  .replace(/;}/g, '}')
  .trim();

const minifyPanelStylesPlugin: BunPlugin = {
  name: 'minify-panel-styles',
  setup(build) {
    build.onLoad({ filter: /src[\\/]panel[\\/]styles\.ts$/ }, () => ({
      contents: `export const PANEL_CSS = ${JSON.stringify(minifyCss(PANEL_CSS))};`,
      loader: 'ts',
    }));
  },
};

async function buildBundle(entryRel: string, outRel: string, nodeTarget: boolean): Promise<void> {
  const entry = resolve(root, entryRel);
  const outFile = resolve(root, outRel);
  const result = await Bun.build({
    entrypoints: [entry],
    format: nodeTarget ? 'esm' : 'iife',
    target: nodeTarget ? 'node' : 'browser',
    minify: !nodeTarget,
    plugins: nodeTarget ? [] : [minifyPanelStylesPlugin],
  });

  if (!result.success) {
    for (const log of result.logs) {
      console.error(log);
    }
    throw new Error(`Build failed for ${entryRel}`);
  }

  const artifact = result.outputs[0];
  if (!artifact) {
    throw new Error(`No bundle artifact produced for ${entryRel}`);
  }

  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, await artifact.text(), 'utf8');
  console.log(`Built ${outRel} (${nodeTarget ? 'node/esm' : 'browser/iife'})`);
}

if (import.meta.main) {
  await buildBundle('src/service/main.ts', 'service/main.js', true);
  await buildBundle('src/panel/main.ts', 'panel/main.js', false);
}
