'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import EditableMedia from './EditableMedia';

interface FacilityImage {
  src: string;
  alt: string;
  caption: string;
}

interface FacilityCarouselProps {
  images: FacilityImage[];
}

export default function FacilityCarousel({ images }: FacilityCarouselProps) {
  const carouselImages = useMemo(
    () => images
      .map((image) => ({ ...image, src: image.src.trim() }))
      .filter((image) => image.src),
    [images],
  );
  const imagesKey = carouselImages.map((image) => image.src).join('|');
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const isLooping = carouselImages.length > 1;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(isLooping || emblaApi.canScrollPrev());
    setCanScrollNext(isLooping || emblaApi.canScrollNext());
  }, [emblaApi, carouselImages.length]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit({ loop: carouselImages.length > 1, align: 'center' });
    queueMicrotask(onSelect);
  }, [emblaApi, carouselImages.length, imagesKey, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    queueMicrotask(onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, carouselImages.length, onSelect]);

  // Auto-play
  useEffect(() => {
    if (!emblaApi || carouselImages.length < 2) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi, carouselImages.length]);

  if (carouselImages.length === 0) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100 md:aspect-[21/9]">
        <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
          Facility media
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Carousel */}
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative aspect-[16/9] md:aspect-[21/9]"
            >
              {image.src ? (
                <EditableMedia
                  src={image.src}
                  alt={image.alt || image.caption || `Facility media ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-contain"
                  videoClassName="absolute inset-0 h-full w-full object-contain"
                  fallback={
                    <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                      <div className="text-center text-slate-400">
                        <svg className="w-20 h-20 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">{image.alt}</p>
                      </div>
                    </div>
                  }
                />
              ) : (
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <svg className="w-20 h-20 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">{image.alt}</p>
                  </div>
                </div>
              )}

              {/* Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-6">
                <motion.p
                  key={selectedIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white font-medium text-lg"
                >
                  {image.caption}
                </motion.p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5 text-slate-700" />
      </button>
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5 text-slate-700" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedIndex
                ? 'bg-slate-800 w-6'
                : 'bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
