import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageCode } from '../types';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  toggleLanguage: () => void;
  isAccessibleText: boolean;
  toggleAccessibleText: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('ruralcare_language') as LanguageCode) || 'ta';
  });

  const [isAccessibleText, setIsAccessibleText] = useState<boolean>(() => {
    return localStorage.getItem('ruralcare_accessible_text') === 'true';
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    localStorage.setItem('ruralcare_language', language);
  }, [language, i18n]);

  useEffect(() => {
    if (isAccessibleText) {
      document.body.classList.add('accessible-text');
    } else {
      document.body.classList.remove('accessible-text');
    }
    localStorage.setItem('ruralcare_accessible_text', String(isAccessibleText));
  }, [isAccessibleText]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ta' ? 'en' : 'ta'));
  };

  const toggleAccessibleText = () => {
    setIsAccessibleText((prev) => !prev);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isAccessibleText,
        toggleAccessibleText,
      }}
    >
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
