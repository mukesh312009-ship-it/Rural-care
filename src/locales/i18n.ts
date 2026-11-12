import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en/translation.json';
import taTranslation from './ta/translation.json';

const savedLanguage = localStorage.getItem('ruralcare_language') || 'ta';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ta: { translation: taTranslation }
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
