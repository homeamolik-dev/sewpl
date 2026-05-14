import { mkdir, readFile, readdir, writeFile } from 'fs/promises';
import path from 'path';

export const CONTENT_FILES = [
  'about-content.json',
  'company.json',
  'contact-form-content.json',
  'contact-page-content.json',
  'home-content.json',
  'products.json',
  'services-page-content.json',
  'services.json',
  'site-global.json',
] as const;

export type ContentFileName = (typeof CONTENT_FILES)[number];

const projectRoot = process.cwd();
const dataDir = path.join(projectRoot, 'src', 'data');
const clientContentDir = path.join(projectRoot, 'client-content');
const backupDir = path.join(projectRoot, 'client-content', '.backups');

export function isContentFileName(fileName: string): fileName is ContentFileName {
  return CONTENT_FILES.includes(fileName as ContentFileName);
}

export async function readContentFile<T = unknown>(fileName: ContentFileName): Promise<T> {
  const filePath = path.join(dataDir, fileName);
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

export async function readAllContent() {
  const entries = await Promise.all(
    CONTENT_FILES.map(async (fileName) => [fileName, await readContentFile(fileName)] as const),
  );

  return Object.fromEntries(entries) as Record<ContentFileName, unknown>;
}

export async function writeContentFile(fileName: ContentFileName, value: unknown) {
  const serialized = `${JSON.stringify(value, null, 2)}\n`;
  JSON.parse(serialized);

  await mkdir(backupDir, { recursive: true });
  await mkdir(clientContentDir, { recursive: true });

  const current = await readFile(path.join(dataDir, fileName), 'utf8').catch(() => '');
  if (current) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    await writeFile(path.join(backupDir, `${fileName}.${stamp}.bak`), current, 'utf8');
  }

  await writeFile(path.join(dataDir, fileName), serialized, 'utf8');
  await writeFile(path.join(clientContentDir, fileName), serialized, 'utf8');
}

export type UploadedMedia = {
  name: string;
  url: string;
  type: 'image' | 'video' | 'other';
  size: number;
  modifiedAt: string;
};

export async function listUploadedMedia(): Promise<UploadedMedia[]> {
  const uploadDir = path.join(projectRoot, 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  const files = await readdir(uploadDir, { withFileTypes: true });

  const media = await Promise.all(
    files
      .filter((file) => file.isFile())
      .map(async (file) => {
        const fullPath = path.join(uploadDir, file.name);
        const stats = await import('fs/promises').then(({ stat }) => stat(fullPath));
        const ext = path.extname(file.name).toLowerCase();
        const type: UploadedMedia['type'] = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)
          ? 'image'
          : ['.mp4', '.webm', '.mov'].includes(ext)
            ? 'video'
            : 'other';

        return {
          name: file.name,
          url: `/uploads/${file.name}`,
          type,
          size: stats.size,
          modifiedAt: stats.mtime.toISOString(),
        };
      }),
  );

  return media.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
}
