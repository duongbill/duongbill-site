'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/utils/lang';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  // Load language from localStorage on client side
  useEffect(() => {
    const savedLang = localStorage.getItem('portfolio-lang');
    if (savedLang === 'en' || savedLang === 'vi') {
      setLang(savedLang);
    } else {
      const browserLang = navigator.language;
      if (browserLang && browserLang.startsWith('vi')) {
        setLang('vi');
      }
    }
  }, []);

  const changeLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'vi') {
      setLang(newLang);
      localStorage.setItem('portfolio-lang', newLang);
    }
  };

  // Safe selector for translation keys (e.g. t('nav.home'))
  const t = (path) => {
    const keys = path.split('.');
    let result = translations[lang];
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        return path;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
