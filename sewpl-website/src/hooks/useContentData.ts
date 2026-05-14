'use client';

import { useEffect, useState } from 'react';

type ContentMap = Record<string, unknown>;

export function useContentData<T extends ContentMap>(initialContent: T): T {
  const [content, setContent] = useState<T>(initialContent);

  useEffect(() => {
    let active = true;

    fetch('/api/content', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((liveContent) => {
        if (active && liveContent) {
          setContent((previous) => ({ ...previous, ...liveContent }));
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  return content;
}
