'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Play } from 'lucide-react';
import EditableMedia from './EditableMedia';

type ProductMediaCarouselProps = {
  media: string[];
  productName: string;
};

function isVideo(src: string) {
  return /\.(mp4|webm|mov)$/i.test(src);
}

export default function ProductMediaCarousel({ media, productName }: ProductMediaCarouselProps) {
  const items = media.filter(Boolean);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: items.length > 1, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit({ loop: items.length > 1, align: 'start' });
  }, [emblaApi, items.length]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    queueMicrotask(onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (items.length === 0) {
    return (
      <div className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
        <div className="text-center text-slate-400">
          <ImageIcon className="mx-auto mb-2 h-12 w-12 text-slate-300" />
          <p>Product Image</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-slate-100" ref={emblaRef}>
        <div className="flex">
          {items.map((src, index) => (
            <div key={`${src}-${index}`} className="min-w-0 flex-[0_0_100%]">
              <div className="aspect-square overflow-hidden bg-slate-100">
                <EditableMedia
                  src={src}
                  alt={`${productName} ${index + 1}`}
                  className="h-full w-full object-cover"
                  videoClassName="h-full w-full object-cover"
                  fallback={
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <div className="text-center">
                        <ImageIcon className="mx-auto mb-2 h-12 w-12 text-slate-300" />
                        <p>Product Image</p>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur-sm transition hover:bg-white disabled:opacity-50"
              aria-label="Previous product media"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur-sm transition hover:bg-white disabled:opacity-50"
              aria-label="Next product media"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {items.map((src, index) => (
            <button
              type="button"
              key={`${src}-thumb-${index}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`relative aspect-square overflow-hidden rounded-lg border bg-slate-100 ${
                selectedIndex === index ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-400'
              }`}
              aria-label={`Show product media ${index + 1}`}
            >
              {isVideo(src) ? (
                <>
                  <video src={src} className="h-full w-full object-cover" muted playsInline />
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-900/20 text-white">
                    <Play className="h-5 w-5 fill-white" />
                  </span>
                </>
              ) : (
                <EditableMedia src={src} alt={`${productName} thumbnail ${index + 1}`} className="h-full w-full object-cover" fallback={<ImageIcon className="m-auto h-6 w-6 text-slate-300" />} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
