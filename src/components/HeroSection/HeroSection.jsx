'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';
import styles from './HeroSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const { t } = useLanguage();

  const names = ['Hai Duong', 'DuongBill', 'DuongNH'];
  const [currentName, setCurrentName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timer;
    const nameIndex = loopNum % names.length;
    const fullText = names[nameIndex];

    const tick = () => {
      if (!isDeleting) {
        const nextText = fullText.substring(0, currentName.length + 1);
        setCurrentName(nextText);

        if (nextText === fullText) {
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, 1500);
          return;
        }

        const typingDelay = 80 + Math.random() * 40;
        timer = setTimeout(tick, typingDelay);
      } else {
        const nextText = fullText.substring(0, currentName.length - 1);
        setCurrentName(nextText);

        if (nextText === '') {
          setIsDeleting(false);
          setLoopNum((prev) => prev + 1);
          return;
        }

        timer = setTimeout(tick, 40);
      }
    };

    timer = setTimeout(tick, isDeleting ? 40 : 100);

    return () => clearTimeout(timer);
  }, [currentName, isDeleting, loopNum]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge Hello animation
      gsap.from(`.${styles.badgeHello}`, {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });

      // Title animation (sliding up inside the overflow hidden wrapper)
      gsap.from(`.${styles.titleLine}`, {
        y: '100%',
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.15,
        delay: 0.4,
      });

      // Description animation
      gsap.from(`.${styles.heroDesc}`, {
        y: 25,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.85,
      });

      // Actions animation
      gsap.from(`.${styles.heroActions}`, {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1.05,
      });

      // Avatar Wrapper animation
      gsap.from(`.${styles.avatarWrapper}`, {
        scale: 0.85,
        opacity: 0,
        duration: 1.2,
        ease: 'back.out(1.2)',
        delay: 0.6,
      });

      // Scroll indicator animation
      gsap.from(scrollIndicatorRef.current, {
        opacity: 0,
        duration: 1,
        delay: 1.3,
      });

      // Floating icons animation and scroll parallax only on desktop
      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        const icons = sectionRef.current?.querySelectorAll(`.${styles.floatingIcon}`);
        if (icons && icons.length) {
          icons.forEach((icon, index) => {
            gsap.to(icon, {
              x: "random(-15, 15)",
              y: "random(-15, 15)",
              rotation: "random(-15, 15)",
              duration: "random(5, 8)",
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: index * 0.2,
            });
          });
        }

        // Parallax elements on scroll
        gsap.to(contentRef.current, {
          y: -80,
          opacity: 0.5,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      });

    }, sectionRef);

    const sectionEl = sectionRef.current;
    const contentEl = contentRef.current;
    let cleanupMouse = () => {};

    if (sectionEl && contentEl) {
      const maxX = 18;
      const maxY = 12;
      const xTo = gsap.quickTo(contentEl, 'x', {
        duration: 0.6,
        ease: 'power3.out',
      });
      const yTo = gsap.quickTo(contentEl, 'y', {
        duration: 0.6,
        ease: 'power3.out',
      });

      const handleMouseMove = (event) => {
        if (window.innerWidth <= 768) return;
        const rect = sectionEl.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;
        xTo(relX * maxX);
        yTo(relY * maxY);

        // Parallax for floating icons
        const floatIcons = sectionEl.querySelectorAll(`.${styles.floatingIcon}`);
        floatIcons.forEach((icon, index) => {
          const depthX = (index % 3 + 1) * 16;
          const depthY = (index % 2 + 1) * 10;
          gsap.to(icon, {
            xPercent: relX * depthX,
            yPercent: relY * depthY,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });
      };

      const handleMouseLeave = () => {
        if (window.innerWidth <= 768) return;
        xTo(0);
        yTo(0);

        const floatIcons = sectionEl.querySelectorAll(`.${styles.floatingIcon}`);
        floatIcons.forEach((icon) => {
          gsap.to(icon, {
            xPercent: 0,
            yPercent: 0,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });
      };

      sectionEl.addEventListener('mousemove', handleMouseMove);
      sectionEl.addEventListener('mouseleave', handleMouseLeave);

      cleanupMouse = () => {
        sectionEl.removeEventListener('mousemove', handleMouseMove);
        sectionEl.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    return () => {
      cleanupMouse();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="home" className={styles.hero}>
      {/* Background Heartbroken SVGs */}
      <div className={styles.bgHeartWrapper}>
        <img src="/heartbroken.svg" className={`${styles.bgHeart} ${styles.heart1}`} alt="" />
        <img src="/heartbroken.svg" className={`${styles.bgHeart} ${styles.heart2}`} alt="" />
        <img src="/heartbroken.svg" className={`${styles.bgHeart} ${styles.heart3}`} alt="" />
        <img src="/heartbroken.svg" className={`${styles.bgHeart} ${styles.heart4}`} alt="" />
      </div>

      {/* Shared Gradient Defs */}
      <svg style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-secondary)" />
          </linearGradient>
        </defs>
      </svg>



      {/* Main Grid Content */}
      <div ref={contentRef} className={styles.heroContent}>
        
        {/* Left Column (Text & Buttons) */}
        <div className={styles.textContent}>
          <div className={styles.badgeHello}>
            {t('hero.hello')}
            <svg className={styles.badgeLines} width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 14C6 11 11 10 14 12M6 8C9 6 14 7 16 10M9 4C13 3 17 5 18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <h1 ref={titleRef} className={styles.heroTitle}>
            <span className={styles.titleLineWrapper}>
              <span className={`${styles.titleLine} title-line-anim`}>{t('hero.titlePart1')}{' '}<span className={styles.accentWord}>{currentName}<span className={styles.typewriterCursor}>|</span></span>,</span>
            </span>
            <span className={styles.titleLineWrapper}>
              <span className={`${styles.titleLine} title-line-anim`}>{t('hero.titlePart2')}</span>
            </span>
          </h1>

          <p className={styles.heroDesc}>
            {t('hero.desc')}
          </p>

          <div className={styles.heroActions}>
            <a href="#projects" className={styles.btnPortfolio}>
              {t('hero.portfolioBtn')}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <a href="#contact" className={styles.btnHire}>
              {t('hero.hireBtn')}
            </a>
          </div>
        </div>

        {/* Right Column (Avatar Image) */}
        <div className={styles.imageContent}>
          <div className={styles.avatarWrapper}>
            <div className={styles.bgCircle} />
            <div className={styles.glowRing1} />
            <div className={styles.glowRing2} />

            {/* Rotating text ring around the avatar circle */}
            <svg viewBox="0 0 200 200" className={styles.rotatingTextRing}>
              <path
                id="avatarTextPath"
                d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                fill="none"
              />
              <text className={styles.ringText}>
                <textPath href="#avatarTextPath" startOffset="0%">
                  DUONG<tspan fill="var(--accent)" fontWeight="900">BILL</tspan> • NGUYEN HAI DUONG • DUONG<tspan fill="var(--accent)" fontWeight="900">BILL</tspan> • NGUYEN HAI DUONG •
                </textPath>
              </text>
            </svg>

            <img
              src="/media/profile/anhbia.png"
              alt="Duong Nguyen portrait"
              className={styles.avatarImage}
              onError={(e) => {
                // If it fails, fallback to a clean illustration/image placeholder
                e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600";
              }}
            />

            {/* Floating Job-related Icons (placed around the avatar wrapper) */}
            <div className={`${styles.floatingIcon} ${styles.icon1}`} data-cursor-label="Tech">
              <svg className={styles.iconSvg} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#blueGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>

            <div className={`${styles.floatingIcon} ${styles.icon2}`} data-cursor-label="Code">
              <svg className={styles.iconSvg} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#blueGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
                <line x1="14" y1="4" x2="10" y2="20" />
              </svg>
            </div>

            <div className={`${styles.floatingIcon} ${styles.icon3}`} data-cursor-label="Idea">
              <svg className={styles.iconSvg} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#blueGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.5.6 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <line x1="9" y1="18" x2="15" y2="18" />
                <line x1="10" y1="22" x2="14" y2="22" />
              </svg>
            </div>

            <div className={`${styles.floatingIcon} ${styles.icon4}`} data-cursor-label="Data">
              <svg className={styles.iconSvg} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#blueGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
              </svg>
            </div>

            <div className={`${styles.floatingIcon} ${styles.icon5}`} data-cursor-label="Chat">
              <svg className={styles.iconSvg} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#blueGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>

            <div className={`${styles.floatingIcon} ${styles.icon6}`} data-cursor-label="WebGL">
              <svg className={styles.iconSvg} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#blueGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
        <div className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll</span>
      </div>
    </section>
  );
}
