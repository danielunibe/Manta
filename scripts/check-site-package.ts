import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(`MANTA site contract failed: ${message}`);
};

const hostingPath = resolve(root, '.openai', 'hosting.json');
const distIndexPath = resolve(root, 'dist', 'index.html');
assert(existsSync(hostingPath), 'hosting metadata must exist');

const hosting = JSON.parse(readFileSync(hostingPath, 'utf8')) as {
  project_id?: string;
  static?: { directory?: string };
};

assert(Boolean(hosting.project_id), 'hosting metadata must reference the existing Site');
assert(hosting.static?.directory === 'dist', 'static output must be dist');
assert(existsSync(distIndexPath), 'production output must contain dist/index.html');

const forbiddenRemoteMarkers = ['qwenlm.ai', 'unsplash.com', 'cdn.jsdelivr.net'];
const sourceFiles = [
  resolve(root, 'src', 'data', 'magazines.ts'),
  resolve(root, 'src', 'components', 'navigation', 'menu', 'menuData.ts'),
  resolve(root, 'src', 'domain', 'augustCatalog.ts'),
  distIndexPath
];

const collectFiles = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = resolve(directory, entry.name);
  return entry.isDirectory() ? collectFiles(file) : [file];
});

const filesToInspect = [
  ...sourceFiles,
  ...collectFiles(resolve(root, 'dist'))
];

for (const file of filesToInspect) {
  const source = readFileSync(file, 'utf8').toLowerCase();
  assert(!forbiddenRemoteMarkers.some((marker) => source.includes(marker)), `remote asset dependency found in ${file}`);
}

console.log('MANTA site PASS · static metadata, local active assets and dist output verified');
