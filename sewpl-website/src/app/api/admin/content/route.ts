import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { CONTENT_FILES, isContentFileName, readAllContent, writeContentFile } from '@/lib/content-store';
import { validateContentValue } from '@/lib/content-validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    files: CONTENT_FILES,
    content: await readAllContent(),
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const fileName = typeof body?.fileName === 'string' ? body.fileName : '';

  if (!isContentFileName(fileName)) {
    return NextResponse.json({ error: 'Unknown content file' }, { status: 400 });
  }

  const validationError = validateContentValue(fileName, body?.value);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    await writeContentFile(fileName, body.value);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not save content' },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
