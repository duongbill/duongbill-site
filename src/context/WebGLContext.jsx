'use client';

import { createContext, useContext } from 'react';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';

const WebGLContext = createContext({ enabled: true });

export function WebGLProvider({ children }) {
  const enabled = useWebGLSupport();

  return (
    <WebGLContext.Provider value={{ enabled }}>
      {children}
    </WebGLContext.Provider>
  );
}

export const useWebGL = () => useContext(WebGLContext);
