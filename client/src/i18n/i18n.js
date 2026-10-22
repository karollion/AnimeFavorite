import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import pl from './locales/pl/translation.json'
import en from './locales/en/translation.json'

const savedLanguage = localStorage.getItem('appLanguage')

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pl: { translation: pl },
      en: { translation: en },
    },
    lng: savedLanguage === 'pl' ? 'pl' : 'en',
    fallbackLng: 'en',
    supportedLngs: ['pl', 'en'],
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n