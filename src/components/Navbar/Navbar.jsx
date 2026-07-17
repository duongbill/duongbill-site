'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('#home');
  const pathname = usePathname();
  const { lang, changeLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Intersection Observer for scroll spy active link state
  useEffect(() => {
    if (pathname !== '/') return;

    const sections = ['home', 'about', 'projects', 'gallery', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHash(`#${entry.target.id}`);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [pathname]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleNavClick = (e, href) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
    setActiveHash(href);
  };

  const toggleLanguage = () => {
    changeLanguage(lang === 'en' ? 'vi' : 'en');
  };

  return (
    <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.capsule}>
        {/* Left Links */}
        <div className={styles.leftLinks}>
          <a
            href="#home"
            className={`${styles.link} ${activeHash === '#home' ? styles.active : ''}`}
            onClick={(e) => handleNavClick(e, '#home')}
          >
            {t('nav.home')}
          </a>
          <a
            href="#about"
            className={`${styles.link} ${activeHash === '#about' ? styles.active : ''}`}
            onClick={(e) => handleNavClick(e, '#about')}
          >
            {t('nav.about')}
          </a>
          <a
            href="#projects"
            className={`${styles.link} ${activeHash === '#projects' ? styles.active : ''}`}
            onClick={(e) => handleNavClick(e, '#projects')}
          >
            {t('nav.projects')}
          </a>
        </div>

        {/* Center Logo */}
        <Link
          href="/"
          className={styles.logo}
          onClick={(e) => handleNavClick(e, '#home')}
        >
          <span className={styles.logoText}>Duong</span>
          <span className={styles.logoDot}>Bill</span>
        </Link>

        {/* Right Links */}
        <div className={styles.rightLinks}>
          <a
            href="#gallery"
            className={`${styles.link} ${activeHash === '#gallery' ? styles.active : ''}`}
            onClick={(e) => handleNavClick(e, '#gallery')}
          >
            {t('nav.gallery')}
          </a>
          <a
            href="#contact"
            className={`${styles.link} ${activeHash === '#contact' ? styles.active : ''}`}
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            {t('nav.contact')}
          </a>
          <button onClick={toggleLanguage} className={styles.langSwitch} aria-label="Toggle language">
            {lang === 'en' ? 'VI' : 'EN'}
          </button>
          <a
            href="mailto:duongbill.dev@gmail.com"
            className={styles.talkLink}
          >
            {t('nav.talk')} <span className={styles.talkArrow}>↗</span>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Links Overlay */}
      <div className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayOpen : ''}`}>
        <a
          href="#home"
          className={`${styles.mobileLink} ${activeHash === '#home' ? styles.mobileActive : ''}`}
          onClick={(e) => handleNavClick(e, '#home')}
        >
          {t('nav.home')}
        </a>
        <a
          href="#about"
          className={`${styles.mobileLink} ${activeHash === '#about' ? styles.mobileActive : ''}`}
          onClick={(e) => handleNavClick(e, '#about')}
        >
          {t('nav.about')}
        </a>
        <a
          href="#projects"
          className={`${styles.mobileLink} ${activeHash === '#projects' ? styles.mobileActive : ''}`}
          onClick={(e) => handleNavClick(e, '#projects')}
        >
          {t('nav.projects')}
        </a>
        <a
          href="#gallery"
          className={`${styles.mobileLink} ${activeHash === '#gallery' ? styles.mobileActive : ''}`}
          onClick={(e) => handleNavClick(e, '#gallery')}
        >
          {t('nav.gallery')}
        </a>
        <a
          href="#contact"
          className={`${styles.mobileLink} ${activeHash === '#contact' ? styles.mobileActive : ''}`}
          onClick={(e) => handleNavClick(e, '#contact')}
        >
          {t('nav.contact')}
        </a>
        <a
          href="mailto:duongbill.dev@gmail.com"
          className={styles.mobileLink}
        >
          {t('nav.talk')} ↗
        </a>
        <button onClick={toggleLanguage} className={styles.mobileLangSwitch}>
          {lang === 'en' ? 'Tiếng Việt' : 'English'}
        </button>
      </div>
    </nav>
  );
}
