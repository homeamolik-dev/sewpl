'use client';

import { ReactNode, useState } from 'react';

type EditableMediaProps = {
  src?: string;
  alt: string;
  className?: string;
  videoClassName?: string;
  fallback?: ReactNode;
};

export function isVideoMedia(src?: string) {
  return Boolean(src && /\.(mp4|webm|mov)$/i.test(src));
}

export default function EditableMedia({ src, alt, className = 'h-full w-full object-cover', videoClassName = className, fallback = null }: EditableMediaProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) return fallback;

  if (isVideoMedia(src)) {
    return <video src={src} className={videoClassName} autoPlay muted playsInline loop controls onError={() => setFailedSrc(src)} />;
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} />;
}
