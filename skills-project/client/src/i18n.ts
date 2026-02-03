import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';
import deDE from './locales/de-DE.json';
import jaJP from './locales/ja-JP.json';
import ruRU from './locales/ru-RU.json';
import koKR from './locales/ko-KR.json';
import frFR from './locales/fr-FR.json';
import arSA from './locales/ar-SA.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': {
        translation: zhCN.translation
      },
      'en-US': {
        translation: enUS.translation
      },
      'de-DE': {
        translation: deDE.translation
      },
      'ja-JP': {
        translation: jaJP.translation
      },
      'ru-RU': {
        translation: ruRU.translation
      },
      'ko-KR': {
        translation: koKR.translation
      },
      'fr-FR': {
        translation: frFR.translation
      },
      'ar-SA': {
        translation: arSA.translation
      }
    },
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;