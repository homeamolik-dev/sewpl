import path from 'path';
import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { listUploadedMedia, uploadMediaFile } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
const allowedTypes: Record<string, { ext: string; maxSize: number; type: 'image' | 'video' }> = {
  'image/jpeg': { ext: '.jpg', maxSize: MAX_IMAGE_SIZE, type: 'image' },
  'image/png': { ext: '.png', maxSize: MAX_IMAGE_SIZE, type: 'image' },
  'image/webp': { ext: '.webp', maxSize: MAX_IMAGE_SIZE, type: 'image' },
  'image/gif': { ext: '.gif', maxSize: MAX_IMAGE_SIZE, type: 'image' },
  'image/svg+xml': { ext: '.svg', maxSize: MAX_IMAGE_SIZE, type: 'image' },
  'video/mp4': { ext: '.mp4', maxSize: MAX_VIDEO_SIZE, type: 'video' },
  'video/webm': { ext: '.webm', maxSize: MAX_VIDEO_SIZE, type: 'video' },
  'video/quicktime': { ext: '.mov', maxSize: MAX_VIDEO_SIZE, type: 'video' },
};

function safeBaseName(name: string) {
  return path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'upload';
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ media: await listUploadedMedia() });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file was uploaded' }, { status: 400 });
  }

  const rule = allowedTypes[file.type];
  if (!rule) {
    return NextResponse.json({ error: 'Only JPG, PNG, WebP, GIF, SVG, MP4, WebM, and MOV files are allowed' }, { status: 400 });
  }

  if (file.size > rule.maxSize) {
    const limit = rule.type === 'image' ? '10MB' : '50MB';
    return NextResponse.json({ error: `${rule.type === 'image' ? 'Image' : 'Video'} uploads are limited to ${limit}` }, { status: 400 });
  }

  const fileName = `${safeBaseName(file.name)}-${Date.now()}${rule.ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const url = await uploadMediaFile(fileName, bytes, file.type);

  return NextResponse.json({
    media: {
      name: fileName,
      url,
      type: rule.type,
      size: file.size,
      modifiedAt: new Date().toISOString(),
    },
  });
}
