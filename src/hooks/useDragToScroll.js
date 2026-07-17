'use client';

import { useEffect } from 'react';

export function useDragToScroll() {
  useEffect(() => {
    let isDown = false;
    let lastY = 0;
    let velocityY = 0;
    let rafId = null;

    const onMouseDown = (e) => {
      // Ignore right click or clicks on interactive elements
      const target = e.target;
      if (
        e.button !== 0 || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('.no-drag')
      ) {
        return;
      }

      isDown = true;
      document.body.style.cursor = 'grabbing';
      lastY = e.pageY;
      velocityY = 0;
      if (rafId) cancelAnimationFrame(rafId);
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault(); // Prevents selection
      const walk = e.pageY - lastY;
      velocityY = walk;
      lastY = e.pageY;

      window.scrollTo({
        top: window.pageYOffset - walk,
        behavior: 'auto'
      });
    };

    const onMouseUp = () => {
      if (!isDown) return;
      isDown = false;
      document.body.style.cursor = '';

      // Decay momentum (friction)
      const momentum = () => {
        if (Math.abs(velocityY) > 0.5) {
          window.scrollTo({
            top: window.pageYOffset - velocityY,
            behavior: 'auto'
          });
          velocityY *= 0.95;
          rafId = requestAnimationFrame(momentum);
        }
      };
      momentum();
    };

    const onMouseLeave = () => {
      if (!isDown) return;
      isDown = false;
      document.body.style.cursor = '';
    };

    window.addEventListener('mousedown', onMouseDown, { passive: false });
    window.addEventListener('mousemove', onMouseMove, { passive: false });
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseleave', onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}
