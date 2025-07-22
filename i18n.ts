import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import translationPT from './locales/pt/translation.json'
import translationEN from './locales/en/translation.json'
import translationES from './locales/es/translation.json'
import translationJA from './locales/ja/translation.json'
import translationZH from './locales/zh/translation.json'
import translationHI from './locales/hi/translation.json'
import translationRU from './locales/ru/translation.json'
import translationKO from './locales/ko/translation.json'

const resources = {
  pt: { translation: translationPT },
  en: { translation: translationEN },
  es: { translation: translationES },
  ja: { translation: translationJA },
  zh: { translation: translationZH },
  hi: { translation: translationHI },
  ru: { translation: translationRU },
  ko: { translation: translationKO }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    debug: true,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    
    interpolation: {
      escapeValue: false
    }
  })

export default i18n