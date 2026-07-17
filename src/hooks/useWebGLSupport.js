'use client';

import { useEffect, useState } from 'react';

export const useWebGLSupport = () => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;
    const lowCore = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;

    setEnabled(!(prefersReduced || coarsePointer || lowMemory || lowCore));
  }, []);

  return enabled;
};
