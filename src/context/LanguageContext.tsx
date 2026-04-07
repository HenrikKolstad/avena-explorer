'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lang, getTranslations, Translations } from '@/lib/translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: getTranslations('en'),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('avena-lang') as Lang | null;
    if (saved && ['en','de','nl','sv','es','fr'].includes(saved)) {
      setLangState(saved);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('avena-lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: getTranslations(lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
