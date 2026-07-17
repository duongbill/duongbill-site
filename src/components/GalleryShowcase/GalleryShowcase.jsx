'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useWebGL } from '@/context/WebGLContext';
import styles from './GalleryShowcase.module.css';

const GalleryCanvas = dynamic(() => import('@/components/webgl/GalleryCanvas'), { ssr: false });

export default function GalleryShowcase({ items }) {
  const { enabled } = useWebGL();
  const [activeIndex, setActiveIndex] = useState(0);

  const images = useMemo(() => items.map((item) => item.image), [items]);
  const activeItem = items[activeIndex];

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className={styles.showcase}>
      <div className={styles.canvasFrame}>
        {enabled ? (
          <GalleryCanvas images={images} activeIndex={activeIndex} className={styles.canvas} />
        ) : (
          <Image
            src={activeItem.image}
            alt={activeItem.title || 'Gallery item'}
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            className={styles.canvasFallback}
            priority
          />
        )}
        <div className={styles.canvasMeta}>
          <span className={styles.canvasLabel}>{activeItem.type}</span>
          <h3 className={styles.canvasTitle}>{activeItem.title}</h3>
          <span className={styles.canvasYear}>{activeItem.year}</span>
        </div>
      </div>

      <div className={styles.controls}>
        <button type="button" onClick={goPrev} className={styles.controlBtn}>
          Prev
        </button>
        <button type="button" onClick={goNext} className={styles.controlBtn}>
          Next
        </button>
      </div>

      <div className={styles.thumbRow}>
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`${styles.thumb} ${index === activeIndex ? styles.thumbActive : ''}`}
            style={{ backgroundImage: `url(${item.image})` }}
            aria-pressed={index === activeIndex}
            aria-label={`View ${item.title}`}
          />
        ))}
      </div>
    </div>
  );
}
