import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const dataDirs = ['src/data', 'client-content'];
const routeFiles = [
  'src/app/page.tsx',
  'src/app/about/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/products/page.tsx',
  'src/app/products/[slug]/page.tsx',
  'src/app/services/page.tsx',
];

function readJson(filePath) {
  return JSON.parse(readFileSync(path.join(projectRoot, filePath), 'utf8'));
}

function walk(value, visitor, location) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, visitor, `${location}[${index}]`));
    return;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => walk(item, visitor, `${location}.${key}`));
    return;
  }

  visitor(value, location);
}

function runTest(name, testFn) {
  testFn();
  console.log(`ok - ${name}`);
}

runTest('main app route files exist', () => {
  for (const routeFile of routeFiles) {
    assert.ok(existsSync(path.join(projectRoot, routeFile)), `${routeFile} is missing`);
  }
});

runTest('content JSON files are parseable', () => {
  for (const dir of dataDirs) {
    for (const fileName of readdirSync(path.join(projectRoot, dir)).filter((file) => file.endsWith('.json'))) {
      assert.doesNotThrow(() => readJson(path.join(dir, fileName)), `${dir}/${fileName} is invalid JSON`);
    }
  }
});

runTest('local public media references exist', () => {
  const missing = [];

  for (const dir of dataDirs) {
    for (const fileName of readdirSync(path.join(projectRoot, dir)).filter((file) => file.endsWith('.json'))) {
      const relativePath = path.join(dir, fileName);
      walk(readJson(relativePath), (value, location) => {
        if (typeof value !== 'string') return;
        if (!value.startsWith('/images/') && !value.startsWith('/uploads/')) return;
        if (/^https?:\/\//i.test(value)) return;

        const publicPath = path.join(projectRoot, 'public', value);
        if (!existsSync(publicPath)) {
          missing.push(`${relativePath}.${location}: ${value}`);
        }
      }, relativePath);
    }
  }

  assert.deepEqual(missing, []);
});
