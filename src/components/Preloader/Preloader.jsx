'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './Preloader.module.css';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const counterRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const counterObj = { value: 0 };
    
    const tl = gsap.timeline({
      onComplete: () => {
        setHidden(true);
      }
    });

    // Rapid, elegant 1.2s entrance sequence
    tl.fromTo(logoRef.current, 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
    )
    .to(counterObj, {
      value: 100,
      duration: 0.95,
      ease: 'power2.out',
      onUpdate: () => {
        const val = Math.round(counterObj.value);
        if (counterRef.current) {
          counterRef.current.textContent = val;
        }
        if (trackRef.current) {
          trackRef.current.style.transform = `scaleX(${val / 100})`;
        }
      }
    }, '-=0.2')
    // Snappy slide up exit animation
    .to(containerRef.current, {
      yPercent: -100,
      duration: 0.55,
      ease: 'power4.inOut',
      onStart: () => {
        // Disable pointer events immediately when exit starts to make UI interactive
        if (containerRef.current) {
          containerRef.current.style.pointerEvents = 'none';
        }
      }
    })
    // Fade out logo and counter during transition
    .to([logoRef.current, counterRef.current, trackRef.current], {
      opacity: 0,
      y: -15,
      duration: 0.3,
      ease: 'power2.in',
    }, '-=0.55');

  }, []);

  if (hidden) return null;

  return (
    <div ref={containerRef} className={styles.preloader}>
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <div ref={logoRef} className={styles.logo}>
            Duong<span>Bill</span>
          </div>
        </div>
        <div className={styles.progressContainer}>
          <div className={styles.track}>
            <div ref={trackRef} className={styles.bar} />
          </div>
          <div ref={counterRef} className={styles.counter}>0</div>
        </div>
      </div>
    </div>
  );
}
