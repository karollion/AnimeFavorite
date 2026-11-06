/**
 * @file Settings.js
 * @description Allows authenticated users to manage their
 * interface, content, and notification preferences.
 */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Row, Col, Form } from 'react-bootstrap'

import styles from './Settings.module.scss'

import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'

import {
  getUser,
  updateProfileRequest,
} from '../../../redux/reducers/userRedux'

import { useMessage } from '../../../context/MessageContext'
import syncTheme from '../../../theme/syncTheme'

/**
 * @component
 * @description Renders the user settings page.
 *
 * Preferences are grouped into three sections:
 * - User Interface
 * - Content
 * - Notifications
 *
 * @returns {JSX.Element} The settings page.
 */
const Settings = () => {
  const dispatch = useDispatch()
  const user = useSelector(getUser)

  const { t, i18n } = useTranslation()
  const { showMessage } = useMessage()

  const {
    register,
    handleSubmit,
    reset,
  } = useForm()

  // Register fields that require custom change handlers.
  const themeField = register('ui.theme')
  const languageField = register('ui.language')

  /**
   * Loads the user's saved preferences into the form.
   */
  useEffect(() => {
    if (user?.preferences) {
      reset(user.preferences)
    }
  }, [user?.preferences, reset])

  /**
   * Changes the application language immediately.
   * The selected language is persisted after a successful form submission.
   *
   * @param {string} language - Selected application language.
   */
  const handleLanguageChange = async language => {
    if (!['en', 'pl'].includes(language)) return

    await i18n.changeLanguage(language)
  }

  /**
   * Changes the application theme immediately.
   * The selected theme is persisted after a successful form submission.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event
   */
  const handleThemeChange = event => {
    const theme = event.target.value

    if (!['light', 'dark'].includes(theme)) return

    document.documentElement.setAttribute('data-theme', theme)
  }

  /**
   * Saves the current preferences to the user's profile.
   *
   * Existing preference groups are merged with the submitted values
   * to avoid overwriting settings that are not part of this form.
   *
   * @param {Object} data - Submitted preference values.
   */
  const onSubmit = async data => {
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

      // Persist the selected language after the server confirms the update.
      const savedLanguage =
        updatedUser?.preferences?.ui?.language || data.ui?.language

      if (['en', 'pl'].includes(savedLanguage)) {
        await i18n.changeLanguage(savedLanguage)
        localStorage.setItem('appLanguage', savedLanguage)
      }

      // Persist and synchronize the selected theme.
      const savedTheme =
        updatedUser?.preferences?.ui?.theme || data.ui?.theme

      if (['light', 'dark'].includes(savedTheme)) {
        localStorage.setItem('appTheme', savedTheme)
        syncTheme(updatedUser)
      }

      await showMessage({
        title: t('common.success'),
        message: t('settings.saveSuccess'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (error) {
      await showMessage({
        title: t('common.error'),
        message: t('settings.saveFailed'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    }
  }

  return (
    <div className={styles.root}>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.root}
      >
        <Container className={styles.container}>

          {/* Page heading */}
          <h1 className={styles.title}>
            {t('settings.title')}
          </h1>

          <Row className={styles.grid}>

            {/* Left column: interface and content preferences */}
            <Col xs="12" lg="6">

              {/* Interface preferences */}
              <div className={styles.section}>
                <h2>{t('settings.userinterface')}</h2>

                {/* Application theme */}
                <div className={styles.row}>
                  <span>{t('settings.theme')}</span>

                  <Form.Select
                    {...themeField}
                    onChange={event => {
                      themeField.onChange(event)
                      handleThemeChange(event)
                    }}
                  >
                    <option value="dark">
                      {t('settings.themeDark')}
                    </option>

                    <option value="light">
                      {t('settings.themeLight')}
                    </option>
                  </Form.Select>
                </div>

                {/* Application language */}
                <div className={styles.row}>
                  <span>{t('settings.language')}</span>

                  <Form.Select
                    {...languageField}
                    onChange={event => {
                      languageField.onChange(event)
                      handleLanguageChange(event.target.value)
                    }}
                  >
                    <option value="en">
                      {t('settings.languageEN')}
                    </option>

                    <option value="pl">
                      {t('settings.languagePL')}
                    </option>
                  </Form.Select>
                </div>

                {/* Default content layout */}
                <div className={styles.row}>
                  <span>{t('settings.defaultView')}</span>

                  <Form.Select {...register('ui.defaultView')}>
                    <option value="grid">
                      {t('settings.grid')}
                    </option>

                    <option value="list">
                      {t('settings.list')}
                    </option>
                  </Form.Select>
                </div>

                {/* Default content sorting method */}
                <div className={styles.row}>
                  <span>{t('settings.defaultSort')}</span>

                  <Form.Select {...register('behavior.defaultSort')}>
                    <option value="rating">
                      {t('settings.defrating')}
                    </option>

                    <option value="newest">
                      {t('settings.defnewest')}
                    </option>

                    <option value="title">
                      {t('settings.deftitle')} (A–Z)
                    </option>
                  </Form.Select>
                </div>
              </div>

              {/* Content preferences */}
              <div className={styles.section}>
                <h2>{t('settings.content')}</h2>

                {/* NSFW content visibility */}
                <div className={styles.row}>
                  <span>{t('settings.showNSFW')}</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('content.showNsfw')}
                  />
                </div>

                {/* Spoiler visibility */}
                <div className={styles.row}>
                  <span>{t('settings.hideSpoilers')}</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('content.hideSpoilers')}
                  />
                </div>

                {/* Preferred content genres */}
                <div className={`${styles.row} ${styles.genresRow}`}>
                  <span>{t('settings.preferredGenres')}</span>

                  <div className={styles.genresList}>

                    <Form.Check
                      type="checkbox"
                      label={t('genres.action')}
                      value="action"
                      {...register('content.preferredGenres')}
                    />

                    <Form.Check
                      type="checkbox"
                      label={t('genres.comedy')}
                      value="comedy"
                      {...register('content.preferredGenres')}
                    />

                    <Form.Check
                      type="checkbox"
                      label={t('genres.drama')}
                      value="drama"
                      {...register('content.preferredGenres')}
                    />

                    <Form.Check
                      type="checkbox"
                      label={t('genres.fantasy')}
                      value="fantasy"
                      {...register('content.preferredGenres')}
                    />

                    <Form.Check
                      type="checkbox"
                      label={t('genres.romance')}
                      value="romance"
                      {...register('content.preferredGenres')}
                    />

                    <Form.Check
                      type="checkbox"
                      label={t('genres.sciFi')}
                      value="sci-fi"
                      {...register('content.preferredGenres')}
                    />

                  </div>
                </div>
              </div>

            </Col>

            {/* Right column: notification preferences */}
            <Col xs="12" lg="6">

              {/* Notification preferences */}
              <div className={styles.section}>
                <h2>{t('settings.notifications')}</h2>

                {/* Email notifications */}
                <div className={styles.row}>
                  <span>{t('settings.email')}</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('notifications.email')}
                  />
                </div>

                {/* In-app notifications */}
                <div className={styles.row}>
                  <span>{t('settings.inApp')}</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('notifications.inApp')}
                  />
                </div>

                {/* Push notifications */}
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

          {/* Form actions */}
          <div className={styles.actions}>

            {/* Save preference changes */}
            <Button type="submit">
              {t('common.save')}
            </Button>

            {/* Return to the home page */}
            <Button to="/">
              {t('common.home')}
            </Button>

          </div>

        </Container>
      </Form>
    </div>
  )
}

export default Settings