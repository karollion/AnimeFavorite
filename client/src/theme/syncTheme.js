
/* =====================================================
   THEME SYNCHRONIZATION
   ===================================================== */

/**
 * @file syncTheme.js
 * @description Applies and persists the selected application theme.
 *
 * Authenticated users use their saved profile preference.
 * Guests use the locally stored theme.
 */

const AVAILABLE_THEMES = ['light', 'dark']

const syncTheme = user => {
  const savedTheme = localStorage.getItem('appTheme')

  const userTheme = user?.preferences?.ui?.theme

  const theme = user
    ? userTheme || savedTheme || 'dark'
    : savedTheme || 'dark'

  const validTheme = AVAILABLE_THEMES.includes(theme)
    ? theme
    : 'dark'

  document.documentElement.setAttribute('data-theme', validTheme)
  localStorage.setItem('appTheme', validTheme)

  return validTheme
}

export default syncTheme
