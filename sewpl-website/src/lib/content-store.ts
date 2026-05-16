import { mkdir, readFile, readdir, writeFile } from 'fs/promises';
import { get, list, put } from '@vercel/blob';
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
const blobContentPath = 'content/site-content.json';
const blobUploadPrefix = 'uploads/';

function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function isContentFileName(fileName: string): fileName is ContentFileName {
  return CONTENT_FILES.includes(fileName as ContentFileName);
}

export async function readContentFile<T = unknown>(fileName: ContentFileName): Promise<T> {
  if (hasBlobStorage()) {
    const allContent = await readAllContent();
    return allContent[fileName] as T;
  }

  const filePath = path.join(dataDir, fileName);
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

async function readAllLocalContent() {
  const entries = await Promise.all(
    CONTENT_FILES.map(async (fileName) => {
      const filePath = path.join(dataDir, fileName);
      const raw = await readFile(filePath, 'utf8');
      return [fileName, JSON.parse(raw)] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<ContentFileName, unknown>;
}

export async function readAllContent() {
  if (hasBlobStorage()) {
    const localContent = await readAllLocalContent();

    try {
      const blob = await get(blobContentPath, { access: 'public' });

      if (blob?.statusCode === 200) {
        const raw = await new Response(blob.stream).text();
        return { ...localContent, ...JSON.parse(raw) } as Record<ContentFileName, unknown>;
      }
    } catch {
      return localContent;
    }

    return localContent;
  }

  return readAllLocalContent();
}

export async function writeContentFile(fileName: ContentFileName, value: unknown) {
  const serialized = `${JSON.stringify(value, null, 2)}\n`;
  JSON.parse(serialized);

  if (hasBlobStorage()) {
    const currentContent = await readAllContent();
    const nextContent = {
      ...currentContent,
      [fileName]: value,
    };

    await put(blobContentPath, JSON.stringify(nextContent, null, 2), {
      access: 'public',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

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
  if (hasBlobStorage()) {
    const blobs = await list({ prefix: blobUploadPrefix });
    return blobs.blobs
      .map((blob) => {
        const ext = path.extname(blob.pathname).toLowerCase();
        const type: UploadedMedia['type'] = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)
          ? 'image'
          : ['.mp4', '.webm', '.mov'].includes(ext)
            ? 'video'
            : 'other';

        return {
          name: path.basename(blob.pathname),
          url: blob.url,
          type,
          size: blob.size,
          modifiedAt: blob.uploadedAt.toISOString(),
        };
      })
      .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
  }

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

export async function uploadMediaFile(fileName: string, bytes: Buffer, contentType: string): Promise<string> {
  if (hasBlobStorage()) {
    const blob = await put(`${blobUploadPrefix}${fileName}`, bytes, {
      access: 'public',
      contentType,
      addRandomSuffix: false,
    });

    return blob.url;
  }

  const uploadDir = path.join(projectRoot, 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), bytes);
  return `/uploads/${fileName}`;
}
