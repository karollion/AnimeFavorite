
import i18n from './i18n'

/**
 * Synchronizes the application language with the user's preferences.
 *
 * Authenticated users use the language saved in their profile.
 * Guests use the language stored in localStorage.
 *
 * @param {Object|null} user - Current authenticated user.
 */
const syncLanguage = user => {
  const userLanguage = user?.preferences?.ui?.language

  const savedLanguage = localStorage.getItem('appLanguage')

  const language = user
    ? userLanguage
    : savedLanguage

  const validLanguage = ['en', 'pl'].includes(language)
    ? language
    : 'en'

  if (i18n.resolvedLanguage !== validLanguage) {
    i18n.changeLanguage(validLanguage)
  }

  localStorage.setItem('appLanguage', validLanguage)
}

export default syncLanguage
