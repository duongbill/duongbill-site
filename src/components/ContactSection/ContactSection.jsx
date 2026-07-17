'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '@/utils/textSplit';
import styles from './ContactSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const contactMethods = [
  { icon: '📞', label: 'Phone', value: '+84 985 082 004', href: 'tel:+84985082004' },
  { icon: '✉️', label: 'Email', value: 'duongbill.dev@gmail.com', href: 'mailto:duongbill.dev@gmail.com' },
  { icon: '💬', label: 'Telegram', value: '@duonggbill', href: 'https://t.me/duonggbill' },
];

export default function ContactSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

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
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        });
      }

      gsap.from('[data-animate="contact-subtitle"]', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      });

      gsap.from('[data-animate="contact-card"]', {
        y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '[data-animate="contact-card"]', start: 'top 85%' },
      });
    }, sectionRef);
    return () => {
      ctx.revert();
      revertSplit();
    };
  }, []);

  return (
    <section ref={sectionRef} id="contact" className={`section ${styles.contact}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 ref={titleRef} className={`${styles.heading} split-text`}>
            Let&apos;s <span className="text-gradient">Connect</span>
          </h2>
          <p data-animate="contact-subtitle" className={styles.subtitle}>
            Choose your preferred way to reach out. I&apos;m always open to new opportunities.
          </p>
        </div>

        <div className={styles.grid}>
          {contactMethods.map((method) => (
            <a
              key={method.label}
              href={method.href}
              target={method.href.startsWith('http') ? '_blank' : undefined}
              rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              data-animate="contact-card"
              className={styles.card}
            >
              <span className={styles.cardIcon}>{method.icon}</span>
              <h4 className={styles.cardLabel}>{method.label}</h4>
              <span className={styles.cardValue}>{method.value}</span>
              <div className={styles.cardGlow} />
            </a>
          ))}
        </div>

        <div data-animate="contact-card" className={styles.cta}>
          <p>Or drop me a line anytime at</p>
          <a href="mailto:duongbill.dev@gmail.com" className={styles.ctaEmail}>
            duongbill.dev@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
