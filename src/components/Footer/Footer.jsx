'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/context/LanguageContext';
import MagneticButton from '@/components/MagneticButton';
import styles from './Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { label: 'FB', name: 'Facebook', href: 'https://www.facebook.com/duongbill/' },
  { label: 'IG', name: 'Instagram', href: 'https://www.instagram.com/duonggbill/' },
  { label: 'GH', name: 'GitHub', href: 'https://github.com/duongbill' },
  { label: 'YT', name: 'YouTube', href: 'https://www.youtube.com/@__traitimtanvo' },
  { label: 'TG', name: 'Telegram', href: 'https://t.me/duonggbill' },
];

export default function Footer() {
  const footerRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-animate="footer-cta"]', {
        y: 80, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: footerRef.current, start: 'top 85%' },
      });
      gsap.from('[data-animate="footer-email"]', {
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2,
        scrollTrigger: { trigger: footerRef.current, start: 'top 80%' },
      });
      gsap.from('[data-animate="footer-social"]', {
        y: 20, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: footerRef.current, start: 'top 75%' },
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className="container">
        {/* Big CTA */}
        <div className={styles.ctaBlock}>
          <p data-animate="footer-cta" className={styles.ctaLabel}>{t('footer.workTogether')}</p>
          <MagneticButton strength={0.2}>
            <a
              data-animate="footer-email"
              href="mailto:duongbill.dev@gmail.com"
              className={styles.ctaEmail}
              data-cursor-label="Send"
            >
              duongbill.dev@gmail.com
            </a>
          </MagneticButton>
        </div>

        <div className={styles.divider} />

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <div className={styles.info}>
            <span className={styles.logo}>
              Duong<span className={styles.accent}>Bill</span>
            </span>
            <span className={styles.copy}>© 2026</span>
          </div>

          <div className={styles.socialsRow}>
            {socials.map((s) => (
              <MagneticButton key={s.label} strength={0.4}>
                <a
                  data-animate="footer-social"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialChip}
                  aria-label={s.name}
                >
                  {s.label}
                </a>
              </MagneticButton>
            ))}
          </div>

          <MagneticButton strength={0.3}>
            <button onClick={scrollToTop} className={styles.backTop} aria-label="Back to top">
              ↑ {t('footer.top')}
            </button>
          </MagneticButton>
        </div>
      </div>

      {/* Grain overlay */}
      <div className={styles.grain} />
    </footer>
  );
}
