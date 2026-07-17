'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '@/utils/textSplit';
import { useLanguage } from '@/context/LanguageContext';
import styles from './ProjectsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    index: '01',
    categoryCode: 'WEB',
    categoryName: 'E-Commerce Platform',
    title: 'Đèn Hải Đăng LC',
    description: 'A premium, modern e-commerce platform for decorative lighting. Developed with robust database structures, search optimizations, cart functions, and an intuitive catalog.',
    tags: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'PWA'],
    image: '/media/projects/denhaidang.jpg',
    imageAlt: 'Den Hai Dang LC project preview',
    link: 'https://denhaidang.com',
    github: null,
    glowColor: 'rgba(0, 242, 254, 0.25)',
  },
  {
    index: '02',
    categoryCode: 'WEB',
    categoryName: 'Media Streaming',
    title: 'Smovie',
    description: 'A comprehensive online movie streaming platform featuring user reviews, customized ratings, and advanced content discovery searches.',
    tags: ['ReactJS', 'Django', 'REST API', 'PostgreSQL'],
    image: '/media/projects/smovie.jpg',
    imageAlt: 'Smovie streaming platform preview',
    link: 'https://smovie.fun/',
    github: 'https://github.com/eja-edo/movie_web',
    glowColor: 'rgba(127, 0, 255, 0.25)',
  },
  {
    index: '03',
    categoryCode: 'MOBILE',
    categoryName: 'Mobile Application',
    title: 'Sbook',
    description: 'An innovative, user-friendly e-book reader application designed for customized layouts, bookmarking, and local progress storage.',
    tags: ['React Native', 'Node.js', 'Express', 'AsyncStorage'],
    image: '/media/projects/sbook.jpg',
    imageAlt: 'Sbook mobile app preview',
    link: null,
    github: 'https://github.com/duongbill/sbook_app',
    glowColor: 'rgba(16, 185, 129, 0.25)',
  },
  {
    index: '04',
    categoryCode: 'ML',
    categoryName: 'AI & Data NLP',
    title: 'Text Summarization',
    description: 'An advanced web-based text summarization tool utilizing Natural Language Processing (NLP) models to compress articles into dense bullet points.',
    tags: ['Python', 'NLTK', 'Transformers', 'Flask'],
    image: '/media/projects/textsummary.jpg',
    imageAlt: 'Text summarization tool preview',
    link: null,
    github: 'https://github.com/duongbill/text_summary',
    glowColor: 'rgba(239, 68, 68, 0.25)',
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const [filter, setFilter] = useState('ALL');
  const { t } = useLanguage();

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

      gsap.from('[data-animate="projects-subtitle"]', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
        },
      });

      // Stagger entrance for grid elements
      const cards = gridRef.current?.querySelectorAll('[data-animate="project-card"]');
      if (cards) {
        gsap.from(cards, {
          y: 60,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
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

  // Animate grid cards when filter changes
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(`.${styles.card}`);
    if (cards && cards.length > 0) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.4, ease: 'power2.out', overwrite: 'auto' }
      );
    }
  }, [filter]);

  const filteredProjects = projects.filter(
    (p) => filter === 'ALL' || p.categoryCode === filter
  );

  return (
    <section ref={sectionRef} id="projects" className={`section ${styles.projects}`}>
      
      {/* Background ambient lighting */}
      <div className={styles.ambientGlowTop} />
      <div className={styles.ambientGlowBottom} />

      <div className="container">
        
        {/* Section Header */}
        <div className={styles.header}>
          <span className={styles.sectionLabel}>{t('projects.showcase')}</span>
          <h2 ref={titleRef} className={`${styles.heading} split-text`}>
            {t('projects.selected')} <span className="text-gradient">{t('projects.projects')}</span>
          </h2>
          <p data-animate="projects-subtitle" className={styles.subtitle}>
            {t('projects.subtitle')}
          </p>
        </div>

        {/* Category Filters */}
        <div className={styles.filterTabs}>
          {['ALL', 'WEB', 'MOBILE', 'ML'].map((cat) => (
            <button
              key={cat}
              className={`${styles.filterTab} ${filter === cat ? styles.activeTab : ''}`}
              onClick={() => setFilter(cat)}
            >
              <span className={styles.tabText}>
                {cat === 'ALL' && t('projects.all')}
                {cat === 'WEB' && t('projects.web')}
                {cat === 'MOBILE' && t('projects.mobile')}
                {cat === 'ML' && t('projects.ml')}
              </span>
            </button>
          ))}
        </div>

        {/* Staggered 2-Column Grid */}
        <div ref={gridRef} className={styles.grid}>
          {filteredProjects.map((project) => {
            // Resolve localized text keys dynamically
            let localizedDesc = project.description;
            let localizedCat = project.categoryName;
            if (project.index === '01') {
              localizedDesc = t('projects.haidangDesc');
              localizedCat = t('projects.haidangCategory');
            } else if (project.index === '02') {
              localizedDesc = t('projects.smovieDesc');
              localizedCat = t('projects.smovieCategory');
            } else if (project.index === '03') {
              localizedDesc = t('projects.sbookDesc');
              localizedCat = t('projects.sbookCategory');
            } else if (project.index === '04') {
              localizedDesc = t('projects.summaryDesc');
              localizedCat = t('projects.summaryCategory');
            }

            return (
              <div 
                key={project.title} 
                data-animate="project-card" 
                className={styles.card}
                style={{ '--project-glow': project.glowColor }}
              >
                
                {/* Mock Browser Window */}
                <div className={styles.browserWindow}>
                  <div className={styles.browserHeader}>
                    <span className={styles.browserDot} style={{ background: '#ff5f56' }} />
                    <span className={styles.browserDot} style={{ background: '#ffbd2e' }} />
                    <span className={styles.browserDot} style={{ background: '#27c93f' }} />
                    <div className={styles.browserAddressBar}>
                      {project.link ? project.link.replace('https://', '') : 'localhost:3000'}
                    </div>
                    <span className={styles.browserTitleCompact}>{project.title.toLowerCase()}.dev</span>
                  </div>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={project.image}
                      alt={project.imageAlt || project.title || 'Project preview'}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className={styles.projectImage}
                    />
                    <div className={styles.imageOverlay} />
                  </div>
                </div>

                {/* Card Details */}
                <div className={styles.cardContent}>
                  
                  <div className={styles.projectHeaderRow}>
                    <span className={styles.projectCategory}>{localizedCat}</span>
                    <span className={styles.projectIndex}>// WORK_{project.index}</span>
                  </div>

                  <h3 className={styles.cardTitle}>
                    {project.title}
                    <span className={styles.arrowIcon}>↗</span>
                  </h3>

                  <p className={styles.cardDesc}>{localizedDesc}</p>
                  
                  <div className={styles.tags}>
                    {project.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        <span className={styles.tagDot} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className={styles.cardLinks}>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.linkBtnPrimary}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        {t('projects.liveDemo')}
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.linkBtnSecondary}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                        {t('projects.source')}
                      </a>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
