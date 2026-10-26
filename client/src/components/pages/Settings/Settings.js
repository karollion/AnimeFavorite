/* =====================================================
   Settings Page
   ===================================================== */

/**
 * @file Settings.js
 * @description Allows authenticated users to manage their
 * interface, content, and notification preferences.
 */

// Styles
import styles from './Settings.module.scss'

// UI components
import { Row, Col, Form } from 'react-bootstrap'
import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'

// Redux
import { getUser, updateProfileRequest } from '../../../redux/reducers/userRedux'
import { useDispatch, useSelector } from 'react-redux'

// Form management
import { useForm } from 'react-hook-form'

// React hooks
import { useEffect, useState } from 'react'

// Translation
import { useTranslation } from 'react-i18next'
import syncTheme from '../../../theme/syncTheme'

/**
 * Settings component.
 *
 * Loads the user's saved preferences into the form and
 * submits changes to the profile update request.
 *
 * Preferences are grouped into three sections:
 * - User Interface
 * - Content
 * - Notifications
 *
 * @component
 * @returns {JSX.Element} The settings page.
 */

const Settings = () => {
  const dispatch = useDispatch()
  const user = useSelector(getUser)

  const [saveStatus, setSaveStatus] = useState(null)

  const { t, i18n } = useTranslation()

  const {
    register,
    handleSubmit,
    reset,
  } = useForm()

  const languageField = register('ui.language')

  /*
   * Changes the application language immediately.
   * The selected language is also stored locally so that
   * it can be restored when the application is reopened.
   *
   * The user's database preference is saved when the
   * Settings form is submitted.
   */
  const handleLanguageChange = async language => {
    if (!['en', 'pl'].includes(language)) return

    await i18n.changeLanguage(language)
    setSaveStatus(null)
  }

  /*
   * Loads the user's saved preferences into the form.
   */
  useEffect(() => {
    if (user?.preferences) {
      reset(user.preferences)
    }
  }, [user?.preferences, reset])

  /*
   * Changes the application theme immediately.
   */
  const handleThemeChange = event => {
    const theme = event.target.value

    if (!['light', 'dark'].includes(theme)) return

    document.documentElement.setAttribute('data-theme', theme)
    setSaveStatus(null)
  }

  /*
   * Saves the current preferences to the user's profile.
   * The selected language is persisted locally only after
   * the server confirms that the profile update succeeded.
   */
  const onSubmit = async data => {
    setSaveStatus(null)
  
    try {
      const updatedUser = await dispatch(
        updateProfileRequest({
          preferences: {
            ...user?.preferences,
            ...data,
            ui: {
              ...user?.preferences?.ui,
              ...data.ui,
            },
            content: {
              ...user?.preferences?.content,
              ...data.content,
            },
            behavior: {
              ...user?.preferences?.behavior,
              ...data.behavior,
            },
            notifications: {
              ...user?.preferences?.notifications,
              ...data.notifications,
            },
          },
        })
      )
    
      const savedLanguage =
        updatedUser?.preferences?.ui?.language || data.ui?.language
    
      if (['en', 'pl'].includes(savedLanguage)) {
        await i18n.changeLanguage(savedLanguage)
        localStorage.setItem('appLanguage', savedLanguage)
      }

      const savedTheme =
        updatedUser?.preferences?.ui?.theme || data.ui?.theme

      if (['light', 'dark'].includes(savedTheme)) {
        localStorage.setItem('appTheme', savedTheme)
        syncTheme(updatedUser)
      }
    
      setSaveStatus('success')
    } catch (error) {
      setSaveStatus('error')
    }
  }


  return (
    <div className={styles.root}>
      {/* Submit all preference changes through a single form */}
      <Form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
        <Container className={styles.container}>

          {/* Page heading */}
          <h1 className={styles.title}>{t('settings.title')}</h1>

          <Row className={styles.grid}>

            {/* LEFT COLUMN */}
            <Col xs="12" lg="6">

              {/* USER INTERFACE SETTINGS */}
              <div className={styles.section}>
                <h2>{t('settings.userinterface')}</h2>

                {/* Preferred application theme */}
                <div className={styles.row}>
                  <span>{t('settings.theme')}</span>

                  <Form.Select
                    {...register('ui.theme')}
                    onChange={event => {
                      register('ui.theme').onChange(event)
                      handleThemeChange(event)
                    }}
                  >
                    <option value="dark">{t('settings.themeDark')}</option>
                    <option value="light">{t('settings.themeLight')}</option>
                  </Form.Select>
                </div>

                {/* Preferred application language */}
                <div className={styles.row}>
                  <span>{t('settings.language')}</span>

                  <Form.Select
                    {...languageField}
                    onChange={event => {
                      languageField.onChange(event)
                      handleLanguageChange(event.target.value)
                    }}
                  >
                    <option value="en">{t('settings.languageEN')}</option>
                    <option value="pl">{t('settings.languagePL')}</option>
                  </Form.Select>
                </div>

                {/* Default layout for displaying content */}
                <div className={styles.row}>
                  <span>{t('settings.defaultView')}</span>

                  <Form.Select {...register('ui.defaultView')}>
                    <option value="grid">{t('settings.grid')}</option>
                    <option value="list">{t('settings.list')}</option>
                  </Form.Select>
                </div>

                {/* Enable or disable automatic playback *
                <div className={styles.row}>
                  <span>Auto Play</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('ui.autoPlay')}
                  />
                </div>/}

                {/* Default sorting method for content */}
                <div className={styles.row}>
                  <span>{t('settings.defaultSort')}</span>

                  <Form.Select {...register('behavior.defaultSort')}>
                    <option value="rating">{t('settings.defrating')}</option>
                    <option value="newest">{t('settings.defnewest')}</option>
                    <option value="title"> {t('settings.deftitle')}(A–Z)</option>
                  </Form.Select>
                </div>
              </div>

              {/* CONTENT SETTINGS */}
              <div className={styles.section}>
                <h2>{t('settings.content')}</h2>

                {/* Control whether NSFW content is displayed */}
                <div className={styles.row}>
                  <span>{t('settings.showNSFW')}</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('content.showNsfw')}
                  />
                </div>

                {/* Control whether spoiler-related content is hidden */}
                <div className={styles.row}>
                  <span>{t('settings.hideSpoilers')}</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('content.hideSpoilers')}
                  />
                </div>

                {/* Select preferred genres using multiple checkboxes */}
                <div className={`${styles.row} ${styles.genresRow}`}>
                  <span>{t('settings.preferredGenres')}</span>

                  <div className={styles.genresList}>

                    {/* Action genre preference */}
                    <Form.Check
                      type="checkbox"
                      label="Action"
                      value="action"
                      {...register('content.preferredGenres')}
                    />

                    {/* Comedy genre preference */}
                    <Form.Check
                      type="checkbox"
                      label="Comedy"
                      value="comedy"
                      {...register('content.preferredGenres')}
                    />

                    {/* Drama genre preference */}
                    <Form.Check
                      type="checkbox"
                      label="Drama"
                      value="drama"
                      {...register('content.preferredGenres')}
                    />

                    {/* Fantasy genre preference */}
                    <Form.Check
                      type="checkbox"
                      label="Fantasy"
                      value="fantasy"
                      {...register('content.preferredGenres')}
                    />

                    {/* Romance genre preference */}
                    <Form.Check
                      type="checkbox"
                      label="Romance"
                      value="romance"
                      {...register('content.preferredGenres')}
                    />

                    {/* Science fiction genre preference */}
                    <Form.Check
                      type="checkbox"
                      label="Sci-Fi"
                      value="sci-fi"
                      {...register('content.preferredGenres')}
                    />
                  </div>
                </div>
              </div>

            </Col>

            {/* RIGHT COLUMN */}
            <Col xs="12" lg="6">

              {/* NOTIFICATION SETTINGS */}
              <div className={styles.section}>
                <h2>{t('settings.notifications')}</h2>

                {/* Enable or disable email notifications */}
                <div className={styles.row}>
                  <span>{t('settings.email')}</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('notifications.email')}
                  />
                </div>

                {/* Enable or disable in-app notifications */}
                <div className={styles.row}>
                  <span>{t('settings.inApp')}</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('notifications.inApp')}
                  />
                </div>

                {/* Enable or disable push notifications */}
                <div className={styles.row}>
                  <span>{t('settings.push')}</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('notifications.push')}
                  />
                </div>
              </div>

            </Col>

          </Row>

          {/* Form actions and save feedback */}
          <div className={styles.actions}>

            {/* Submit the updated preferences */}
            <Button type="submit">{t('common.save')}</Button>

            {/* Navigate back to the home page */}
            <Button to="/">
              {t('common.home')}
            </Button>

            {/* Confirmation displayed after a successful save */}
            {saveStatus === 'success' && (
              <span className={styles.success}>
                {t('settings.saveSuccess')}
              </span>
            )}

            {/* Error message displayed when saving fails */}
            {saveStatus === 'error' && (
              <span className={styles.error}>
                {t('settings.saveFailed')}
              </span>
            )}
          </div>

        </Container>
      </Form>
    </div>
  )
}

export default Settings;