import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { put } from '@vercel/blob';

const contentFiles = [
  'about-content.json',
  'company.json',
  'contact-form-content.json',
  'contact-page-content.json',
  'home-content.json',
  'products-page-content.json',
  'products.json',
  'services-page-content.json',
  'services.json',
  'site-global.json',
];

const manifestPath = 'content/manifest.json';

if (process.env.DISABLE_BLOB_CONTENT_SYNC === '1') {
  console.log('Skipping repo content sync: DISABLE_BLOB_CONTENT_SYNC=1');
  process.exit(0);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.log('Skipping repo content sync: BLOB_READ_WRITE_TOKEN is not set');
  process.exit(0);
}

const projectRoot = process.cwd();
const dataDir = path.join(projectRoot, 'src', 'data');
const entries = await Promise.all(
  contentFiles.map(async (fileName) => {
    const raw = await readFile(path.join(dataDir, fileName), 'utf8');
    return [fileName, JSON.parse(raw)];
  }),
);

const content = Object.fromEntries(entries);
const version = Date.now();
const contentPath = `content/site-content-repo-${version}.json`;

await put(contentPath, JSON.stringify(content, null, 2), {
  access: 'public',
  contentType: 'application/json',
  cacheControlMaxAge: 60,
});

await put(manifestPath, JSON.stringify({ contentPath, source: 'repo-build', updatedAt: new Date().toISOString() }, null, 2), {
  access: 'public',
  allowOverwrite: true,
  contentType: 'application/json',
  cacheControlMaxAge: 60,
});

console.log(`Synced repo content to Vercel Blob: ${contentPath}`);
