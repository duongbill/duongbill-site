'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '@/utils/textSplit';
import { useLanguage } from '@/context/LanguageContext';
import styles from './GallerySection.module.css';

gsap.registerPlugin(ScrollTrigger);

import galleryItems from './galleryItems.json';


const categories = [
  { code: 'ALL', label: 'All Photos', labelVi: 'Tất cả' },
  { code: 'Childhood', label: 'Childhood', labelVi: 'Hồi bé' },
  { code: 'Family', label: 'Family', labelVi: 'Gia đình' },
  { code: 'Friends', label: 'Friends', labelVi: 'Bạn bè' },
  { code: 'Dbill', label: 'Dbill', labelVi: 'Dbill' },
];

export default function GallerySection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  const [filter, setFilter] = useState('ALL');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const { t } = useLanguage();

  // Filter items
  const filteredItems = galleryItems.filter(
    (item) => filter === 'ALL' || item.category === filter
  );

  // Reset zoom state on image change
  useEffect(() => {
    setIsZoomed(false);
  }, [lightboxIndex]);

  // GSAP text animations
  useEffect(() => {
    let revertSplit = () => {};

    const ctx = gsap.context(() => {
      const titleEl = titleRef.current;
      if (titleEl) {
        revertSplit = splitText(titleEl);
        gsap.from(titleEl.querySelectorAll('.split-word'), {
          y: 60,
          opacity: 0,
          duration: 0.9,
          stagger: 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        });
      }

      gsap.from('[data-animate="gallery-subtitle"]', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
        },
      });

      // Initial stagger on grid items
      const cards = gridRef.current?.querySelectorAll(`.${styles.gridItem}`);
      if (cards) {
        gsap.from(cards, {
          y: 40,
          opacity: 0,
          stagger: 0.04,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      revertSplit();
    };
  }, []);

  // Animate grid elements when filter changes
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(`.${styles.gridItem}`);
    if (cards && cards.length > 0) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.03, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }
      );
    }
  }, [filter]);

  // Lightbox Keyboard Navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const showPrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };


  return (
    <section ref={sectionRef} id="portfolio" className={`section ${styles.gallery}`}>
      
      {/* Background Glow */}
      <div className={styles.ambientGlow} />

      <div className="container">
        
        {/* Section Header */}
        <div className={styles.header}>
          <span className={styles.sectionLabel}>{t('gallery.label')}</span>
          <h2 ref={titleRef} className={`${styles.heading} split-text`}>
            {t('gallery.moments')} <span className="text-gradient">{t('gallery.gallery')}</span>
          </h2>
          <p data-animate="gallery-subtitle" className={styles.subtitle}>
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* Category Filters */}
        <div className={styles.filterTabs}>
          {categories.map((cat) => (
            <button
              key={cat.code}
              className={`${styles.filterTab} ${filter === cat.code ? styles.activeTab : ''}`}
              onClick={() => setFilter(cat.code)}
            >
              <span className={styles.tabText}>
                {cat.code === 'ALL' && t('gallery.all')}
                {cat.code === 'Childhood' && t('gallery.childhood')}
                {cat.code === 'Family' && t('gallery.family')}
                {cat.code === 'Friends' && t('gallery.friends')}
                {cat.code === 'Dbill' && t('gallery.dbill')}
              </span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div ref={gridRef} className={styles.grid}>
          {filteredItems.map((item, index) => (
            <div
              key={item.image + index}
              className={styles.gridItem}
              onClick={() => openLightbox(index)}
            >
              <div className={styles.imageCard}>
                <Image
                  src={item.image}
                  alt={item.title || 'Gallery image'}
                  fill
                  sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
                  className={styles.image}
                  unoptimized // Bypasses Next image optimization for raw/large uploads
                />
                
                {/* Modern Hover Info Overlay */}
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <span className={styles.cardCategory}>
                      {item.category === 'Childhood' && t('gallery.childhood')}
                      {item.category === 'Family' && t('gallery.family')}
                      {item.category === 'Friends' && t('gallery.friends')}
                      {item.category === 'Dbill' && t('gallery.dbill')}
                    </span>
                    <h4 className={styles.cardTitle}>
                      {item.title === 'Sweet Memory' && t('gallery.sweetMemory')}
                      {item.title === 'Family Reunion' && t('gallery.familyReunion')}
                      {item.title === 'Family Gathering' && t('gallery.familyGathering')}
                      {item.title === 'Warmth of Home' && t('gallery.warmthOfHome')}
                      {item.title === 'Friendship Story' && t('gallery.friendshipStory')}
                      {item.title === 'Joyful Moments' && t('gallery.joyfulMoments')}
                      {item.title === 'Personal Style' && t('gallery.personalStyle')}
                      {item.title === 'Casual Look' && t('gallery.casualLook')}
                      {item.title === 'Profile Shoot' && t('gallery.profileShoot')}
                      {item.title === 'Candid Shot' && t('gallery.candidShot')}
                      {item.title === 'Studio Session 1' && t('gallery.studioSession1')}
                      {item.title === 'Studio Session 2' && t('gallery.studioSession2')}
                      {!['Sweet Memory', 'Family Reunion', 'Family Gathering', 'Warmth of Home', 'Friendship Story', 'Joyful Moments', 'Personal Style', 'Casual Look', 'Profile Shoot', 'Candid Shot', 'Studio Session 1', 'Studio Session 2'].includes(item.title) && item.title}
                    </h4>
                    <span className={styles.zoomIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* GORGEOUS LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          
          {/* Blurred Background Wallpaper */}
          <div 
            className={styles.lightboxBlurBg} 
            style={{ backgroundImage: `url(${filteredItems[lightboxIndex].image})` }} 
          />

          {/* Close button */}
          <button className={styles.closeBtn} onClick={closeLightbox} aria-label="Close lightbox">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Prev button */}
          <button className={styles.navBtn} onClick={showPrev} style={{ left: '24px' }} aria-label="Previous image">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Next button */}
          <button className={styles.navBtn} onClick={showNext} style={{ right: '24px' }} aria-label="Next image">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Main Content Area */}
          <div className={`${styles.lightboxContainer} ${isZoomed ? styles.zoomedContainer : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className={`${styles.lightboxImageWrapper} ${isZoomed ? styles.zoomedWrapper : ''}`}>
              <img
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                className={`${styles.lightboxImg} ${isZoomed ? styles.zoomedImg : ''}`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
            </div>
            
            {/* Meta Text details */}
            {!isZoomed && (
              <div className={styles.lightboxMeta}>
                <div>
                  <span className={styles.metaCategory}>
                    {filteredItems[lightboxIndex].category === 'Childhood' && t('gallery.childhood')}
                    {filteredItems[lightboxIndex].category === 'Family' && t('gallery.family')}
                    {filteredItems[lightboxIndex].category === 'Friends' && t('gallery.friends')}
                    {filteredItems[lightboxIndex].category === 'Dbill' && t('gallery.dbill')}
                  </span>
                  <h4 className={styles.metaTitle}>
                    {filteredItems[lightboxIndex].title === 'Sweet Memory' && t('gallery.sweetMemory')}
                    {filteredItems[lightboxIndex].title === 'Family Reunion' && t('gallery.familyReunion')}
                    {filteredItems[lightboxIndex].title === 'Family Gathering' && t('gallery.familyGathering')}
                    {filteredItems[lightboxIndex].title === 'Warmth of Home' && t('gallery.warmthOfHome')}
                    {filteredItems[lightboxIndex].title === 'Friendship Story' && t('gallery.friendshipStory')}
                    {filteredItems[lightboxIndex].title === 'Joyful Moments' && t('gallery.joyfulMoments')}
                    {filteredItems[lightboxIndex].title === 'Personal Style' && t('gallery.personalStyle')}
                    {filteredItems[lightboxIndex].title === 'Casual Look' && t('gallery.casualLook')}
                    {filteredItems[lightboxIndex].title === 'Profile Shoot' && t('gallery.profileShoot')}
                    {filteredItems[lightboxIndex].title === 'Candid Shot' && t('gallery.candidShot')}
                    {filteredItems[lightboxIndex].title === 'Studio Session 1' && t('gallery.studioSession1')}
                    {filteredItems[lightboxIndex].title === 'Studio Session 2' && t('gallery.studioSession2')}
                    {!['Sweet Memory', 'Family Reunion', 'Family Gathering', 'Warmth of Home', 'Friendship Story', 'Joyful Moments', 'Personal Style', 'Casual Look', 'Profile Shoot', 'Candid Shot', 'Studio Session 1', 'Studio Session 2'].includes(filteredItems[lightboxIndex].title) && filteredItems[lightboxIndex].title}
                  </h4>
                </div>
                <span className={styles.metaCounter}>
                  {lightboxIndex + 1} / {filteredItems.length}
                </span>
              </div>
            )}
          </div>


        </div>
      )}

    </section>
  );
}
