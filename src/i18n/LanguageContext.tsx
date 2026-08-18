import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations } from './translations';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Check local storage or default to en
    const storedLang = localStorage.getItem('app_language') as Language;
    if (storedLang) {
      setLanguageState(storedLang);
    } else {
      // Auto detect based on google translate cookie if present
      const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
      if (match) {
        setLanguageState(match[1] as Language);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
    
    // Also sync with Google Translate cookie for broader page translation
    const cookieVal = `/en/${lang}`;
    document.cookie = `googtrans=${cookieVal}; path=/`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname}`;
    
    window.location.reload();
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  // Dynamically update hreflang and meta tags when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    
    // Update Hreflang
    let link = document.querySelector('link[rel="alternate"][hreflang="' + language + '"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = language;
      document.head.appendChild(link);
    }
    link.href = window.location.origin + (language === 'en' ? '' : `?lang=${language}`);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
