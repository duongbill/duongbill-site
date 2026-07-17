'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const isHidden = useRef(false);

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window) return;

    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    const onMouseMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (isHidden.current) {
        isHidden.current = false;
        cursor.style.opacity = '1';
        dot.style.opacity = '1';
      }

      // Optimized event delegation: check if hover target is interactive
      const interactiveEl = e.target.closest('a, button, [data-cursor-hover], [role="button"], .project-card, [class*="gridItem"], [class*="card"]');
      if (interactiveEl) {
        if (!isHovering.current) {
          isHovering.current = true;
          cursor.classList.add('custom-cursor--hover');
        }
        const label = interactiveEl.getAttribute('data-cursor-label');
        if (label) {
          cursor.setAttribute('data-label', label);
          cursor.classList.add('custom-cursor--labeled');
        } else {
          cursor.removeAttribute('data-label');
          cursor.classList.remove('custom-cursor--labeled');
        }
      } else {
        if (isHovering.current) {
          isHovering.current = false;
          cursor.classList.remove('custom-cursor--hover', 'custom-cursor--labeled');
          cursor.removeAttribute('data-label');
        }
      }
    };

    const onMouseLeave = () => {
      isHidden.current = true;
      cursor.style.opacity = '0';
      dot.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isHidden.current = false;
      cursor.style.opacity = '1';
      dot.style.opacity = '1';
    };

    const onMouseDown = () => {
      cursor.classList.add('custom-cursor--active');
      dot.classList.add('custom-cursor-dot--active');
    };

    const onMouseUp = () => {
      cursor.classList.remove('custom-cursor--active');
      dot.classList.remove('custom-cursor-dot--active');
    };

    // Lerp animation loop
    let raf;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.12);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.12);

      cursor.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      dot.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;

      raf = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(raf);
    };

  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={cursorDotRef} className="custom-cursor-dot" />
      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
        .custom-cursor {
          position: fixed;
          top: -24px;
          left: -24px;
          width: 48px;
          height: 48px;
          border: 1.5px solid var(--accent);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          transition: width 0.4s var(--ease-out-expo),
                      height 0.4s var(--ease-out-expo),
                      top 0.4s var(--ease-out-expo),
                      left 0.4s var(--ease-out-expo),
                      border-color 0.3s,
                      background-color 0.3s,
                      opacity 0.3s;
          mix-blend-mode: difference;
          will-change: transform;
        }
        .custom-cursor--hover {
          width: 72px;
          height: 72px;
          top: -36px;
          left: -36px;
          border-color: var(--accent);
          background: var(--accent-glow);
        }
        .custom-cursor--active {
          width: 30px;
          height: 30px;
          top: -15px;
          left: -15px;
          border-color: var(--accent);
          background: rgba(56, 110, 203, 0.25);
        }
        .custom-cursor--labeled::after {
          content: attr(data-label);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--accent);
          white-space: nowrap;
        }
        .custom-cursor-dot {
          position: fixed;
          top: -4px;
          left: -4px;
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
          transition: width 0.3s var(--ease-out-expo),
                      height 0.3s var(--ease-out-expo),
                      top 0.3s var(--ease-out-expo),
                      left 0.3s var(--ease-out-expo),
                      background-color 0.3s,
                      opacity 0.3s;
        }
        .custom-cursor-dot--active {
          width: 12px;
          height: 12px;
          top: -6px;
          left: -6px;
          background: #ffffff;
        }

        @media (hover: none), (pointer: coarse) {
          .custom-cursor,
          .custom-cursor-dot {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
