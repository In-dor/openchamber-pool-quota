import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');

async function buildBundle(entryRel: string, outRel: string, nodeTarget: boolean): Promise<void> {
  const entry = resolve(root, entryRel);
  const outFile = resolve(root, outRel);
  const result = await Bun.build({
    entrypoints: [entry],
    format: nodeTarget ? 'esm' : 'iife',
    target: nodeTarget ? 'node' : 'browser',
    minify: !nodeTarget,
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

await buildBundle('src/service/main.ts', 'service/main.js', true);
await buildBundle('src/panel/main.ts', 'panel/main.js', false);
