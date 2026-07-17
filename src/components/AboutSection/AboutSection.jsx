'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '@/utils/textSplit';
import { useLanguage } from '@/context/LanguageContext';
import styles from './AboutSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
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

      // Animate Bento Cards
      gsap.from('[data-animate="bento-card"]', {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      // Animate skill rows inside cards
      gsap.from('[data-animate="skill-row"]', {
        y: 15,
        opacity: 0,
        stagger: 0.04,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: `.${styles.cardSkills}`,
          start: 'top 95%',
        },
      });
    }, sectionRef);

    // Refresh ScrollTrigger positions after layout stabilizes
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timer);
      ctx.revert();
      revertSplit();
    };
  }, []);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (x - xc) / xc;
    const dy = (y - yc) / yc;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.setProperty('--tilt-x', `${-dy * 6}deg`);
    card.style.setProperty('--tilt-y', `${dx * 6}deg`);
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('duongbill.dev@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const skillGroups = [
    {
      title: t('about.langGroup'),
      icon: '💻',
      items: [
        { name: 'JavaScript', icon: '🟨', hover: { bg: '#f7df1e', text: '#1b1b1b', border: '#f7df1e' } },
        { name: 'TypeScript', icon: '🔷', hover: { bg: '#3178c6', text: '#ffffff', border: '#3178c6' } },
        { name: 'Java', icon: '☕', hover: { bg: '#e76f00', text: '#ffffff', border: '#e76f00' } },
        { name: 'HTML5/CSS3', icon: '🌐', hover: { bg: '#e34f26', text: '#ffffff', border: '#e34f26' } },
      ],
    },
    {
      title: t('about.frontendGroup'),
      icon: '🎨',
      items: [
        { name: 'React.js', icon: '⚛️', hover: { bg: '#61dafb', text: '#0b1a24', border: '#61dafb' } },
        { name: 'Angular', icon: '🅰️', hover: { bg: '#dd1b16', text: '#ffffff', border: '#dd1b16' } },
        { name: 'Tailwind CSS', icon: '🌬️', hover: { bg: '#38bdf8', text: '#053b4f', border: '#38bdf8' } },
        { name: 'Ant Design / NG-ZORRO', icon: '🐜', hover: { bg: '#1677ff', text: '#ffffff', border: '#1677ff' } },
      ],
    },
    {
      title: t('about.backendGroup'),
      icon: '🗄️',
      items: [
        { name: 'Node.js', icon: '🟢', hover: { bg: '#3c873a', text: '#ffffff', border: '#3c873a' } },
        { name: 'Java Spring Boot', icon: '🌱', hover: { bg: '#6db33f', text: '#ffffff', border: '#6db33f' } },
        { name: 'MongoDB', icon: '🍃', hover: { bg: '#47a248', text: '#ffffff', border: '#47a248' } },
        { name: 'PostgreSQL', icon: '🐘', hover: { bg: '#336791', text: '#ffffff', border: '#336791' } },
        { name: 'MySQL', icon: '🐬', hover: { bg: '#4479a1', text: '#ffffff', border: '#4479a1' } },
      ],
    },
    {
      title: t('about.devopsGroup'),
      icon: '🛠️',
      items: [
        { name: 'Git/GitHub', icon: '🔧', hover: { bg: '#f05032', text: '#ffffff', border: '#f05032' } },
        { name: 'Figma', icon: '🎨', hover: { bg: '#a259ff', text: '#ffffff', border: '#a259ff' } },
        { name: 'Docker', icon: '🐳', hover: { bg: '#2496ed', text: '#ffffff', border: '#2496ed' } },
        { name: 'Linux', icon: '🐧', hover: { bg: '#f6c343', text: '#1a1a1a', border: '#f6c343' } },
        { name: t('about.skills.cloud'), icon: '☁️', hover: { bg: '#00a1e0', text: '#ffffff', border: '#00a1e0' } },
      ],
    },
    {
      title: t('about.aiTestingGroup'),
      icon: '🤖',
      items: [
        { name: t('about.skills.aiAgents'), icon: '🧠', hover: { bg: '#10b981', text: '#ffffff', border: '#10b981' } },
        { name: t('about.skills.unitTesting'), icon: '🧪', hover: { bg: '#ec4899', text: '#ffffff', border: '#ec4899' } },
      ],
    },
    {
      title: t('about.otherGroup'),
      icon: '🔌',
      items: [
        { name: t('about.skills.embeddedIoT'), icon: '⚡', hover: { bg: '#f59e0b', text: '#ffffff', border: '#f59e0b' } },
      ],
    },
    {
      title: t('about.languagesSpokenGroup'),
      icon: '🗣️',
      items: [
        { name: t('about.skills.englishB1'), icon: '🇬🇧', hover: { bg: '#3b82f6', text: '#ffffff', border: '#3b82f6' } },
      ],
    },
    {
      title: t('about.softSkillsGroup'),
      icon: '🤝',
      items: [
        { name: t('about.skills.typingSpeed'), icon: '⌨️', hover: { bg: '#8b5cf6', text: '#ffffff', border: '#8b5cf6' } },
        { name: t('about.skills.teamWork'), icon: '👥', hover: { bg: '#06b6d4', text: '#ffffff', border: '#06b6d4' } },
        { name: t('about.skills.workPressure'), icon: '🔥', hover: { bg: '#ef4444', text: '#ffffff', border: '#ef4444' } },
      ],
    },
    {
      title: t('about.sportsGroup'),
      icon: '🏆',
      items: [
        { name: t('about.skills.football'), icon: '⚽', hover: { bg: '#22c55e', text: '#ffffff', border: '#22c55e' } },
        { name: t('about.skills.badminton'), icon: '🏸', hover: { bg: '#eab308', text: '#ffffff', border: '#eab308' } },
        { name: t('about.skills.pickleball'), icon: '🏓', hover: { bg: '#ff7849', text: '#ffffff', border: '#ff7849' } },
        { name: t('about.skills.chess'), icon: '♟️', hover: { bg: '#78350f', text: '#ffffff', border: '#78350f' } },
        { name: t('about.skills.xiangqi'), icon: '🏮', hover: { bg: '#b91c1c', text: '#ffffff', border: '#b91c1c' } },
      ],
    },
  ];

  const workExperience = [
    {
      place: 'MH Solution',
      role: t('about.roles.mhRole'),
      period: t('about.periods.mhPeriod'),
      details: t('about.mhSolutionDetails')
    },
    {
      place: t('about.companies.zensho'),
      role: t('about.roles.zenshoRole'),
      period: t('about.periods.zenshoPeriod'),
      details: t('about.zenshoDetails')
    }
  ];

  const educationList = [
    {
      place: 'Electric Power University',
      role: 'Software Engineering Major',
      period: t('about.periods.epuPeriod'),
      details: t('about.epuDetails')
    },
    {
      place: 'Self-Directed Coding',
      role: 'Creative Tech & Interactive Web',
      period: t('about.periods.selfPeriod'),
      details: t('about.selfStudyDetails')
    }
  ];

  return (
    <section ref={sectionRef} id="about" className={`section ${styles.about}`}>
      <div className="container">
        
        <div className={styles.bentoGrid}>
          
          {/* Card 1: Bio Card */}
          <div 
            data-animate="bento-card"
            className={`${styles.bentoCard} ${styles.cardBio}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.cardContent}>
              <div className={styles.bioHeader}>
                <h2 ref={titleRef} className={`${styles.bioName} split-text`}>
                  DUONG NGUYEN HAI
                </h2>

                <div className={styles.cvBioRow}>
                  <a
                    href="/CV_Duong0985082004_VN.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cvBioBtn}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    CV Tiếng Việt
                  </a>
                  <a
                    href="/CV_Duong0985082004_ENG.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.cvBioBtn} ${styles.cvBioBtnOutline}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    CV Tiếng Anh
                  </a>
                </div>
              </div>

              <p className={styles.bioIntro}>
                {t('about.bioIntro')}
              </p>

              <p className={styles.bioText}>
                {t('about.bioText')}
              </p>

              <div className={styles.socialRow}>
                <a href="https://www.facebook.com/duongbill/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/duonggbill/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://github.com/duongbill" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
          </div>


          {/* Card 3: Profile Specs & Email Card */}
          <div 
            data-animate="bento-card"
            className={`${styles.bentoCard} ${styles.cardSpecs}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.specsHeader}>
              <h3 className={styles.specsTitle}>{t('about.specsTitle')}</h3>
            </div>

            <div className={styles.specsList}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('about.specName')}</span>
                <span className={styles.specValue}>Nguyen Hai Duong</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('about.specAge')}</span>
                <span className={styles.specValue}>21</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('about.specRole')}</span>
                <span className={styles.specValue}>{t('about.specs.role')}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('about.specOrigin')}</span>
                <span className={styles.specValue}>{t('about.specs.origin')}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('about.specFocus')}</span>
                <span className={styles.specValue}>{t('about.specs.focus')}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('about.specTheme')}</span>
                <span className={styles.specValue}>{t('about.specs.theme')}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('about.specPhone')}</span>
                <span className={styles.specValue}>{t('about.specs.phone')}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>{t('about.specEmail')}</span>
                <span className={styles.specValue}>{t('about.specs.email')}</span>
              </div>
            </div>

            <div className={styles.quickConnect}>
              <div className={styles.connectLabel}>{t('about.connectLabel')}</div>
              <div className={styles.copyContainer}>
                <span className={styles.emailText}>duongbill.dev@gmail.com</span>
                <button 
                  onClick={handleCopyEmail} 
                  className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <span className={styles.btnText}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      {t('about.copied')}
                    </span>
                  ) : (
                    <span className={styles.btnText}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      {t('about.copy')}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Skills Bento Card */}
          <div 
            data-animate="bento-card"
            className={`${styles.bentoCard} ${styles.cardSkills}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{t('about.techStackTitle')}</h3>
            </div>
            
            <div className={styles.specsList}>
              {skillGroups.slice(0, showAllSkills ? skillGroups.length : 4).map((group) => (
                <div key={group.title} className={styles.specItem} data-animate="skill-row">
                  <span className={styles.specLabel}>{group.title}</span>
                  <span className={styles.specValue}>
                    {group.items.map(item => item.name).join(', ')}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.toggleSkillsWrapper}>
              <button 
                onClick={() => setShowAllSkills(!showAllSkills)} 
                className={styles.toggleSkillsBtn}
              >
                {showAllSkills ? t('about.showLess') : t('about.showMore')}
                <svg 
                  className={`${styles.toggleArrow} ${showAllSkills ? styles.arrowRotate : ''}`} 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>


          {/* Card 6: Professional Journey (Timeline) Card */}
          <div 
            data-animate="bento-card"
            className={`${styles.bentoCard} ${styles.cardTimeline}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.timelineBentoHeader}>
              <h3 className={styles.cardTitle}>{t('about.journeyTitle')}</h3>
              <span className={styles.cardSub}>{t('about.journeySub')}</span>
            </div>

            <div className={styles.timelineSplitGrid}>
              
              {/* Column 1: Work Experience */}
              <div className={styles.timelineColumn}>
                <h4 className={styles.timelineColHeading}>
                  <span className={styles.colIcon}>💼</span> {t('about.workExperience')}
                </h4>
                
                <div className={styles.timelineContainer}>
                  <div className={styles.timelinePath} />
                  
                  {workExperience.map((item) => (
                    <div key={item.place} className={styles.timelineItem}>
                      <span className={styles.timelineMarker} />
                      <div className={styles.timelineHeaderRow}>
                        <h5 className={styles.timelinePlace}>{item.place}</h5>
                        <span className={styles.timelinePeriod}>{item.period}</span>
                      </div>
                      <div className={styles.timelineRole}>{item.role}</div>
                      <ul className={styles.timelineList}>
                        {item.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Education */}
              <div className={styles.timelineColumn}>
                <h4 className={styles.timelineColHeading}>
                  <span className={styles.colIcon}>🎓</span> {t('about.education')}
                </h4>
                
                <div className={styles.timelineContainer}>
                  <div className={styles.timelinePath} />
                  
                  {educationList.map((item) => (
                    <div key={item.place} className={styles.timelineItem}>
                      <span className={styles.timelineMarker} />
                      <div className={styles.timelineHeaderRow}>
                        <h5 className={styles.timelinePlace}>{item.place}</h5>
                        <span className={styles.timelinePeriod}>{item.period}</span>
                      </div>
                      <div className={styles.timelineRole}>{item.role}</div>
                      <ul className={styles.timelineList}>
                        {item.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
