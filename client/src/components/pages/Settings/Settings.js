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

  // Redux dispatch function and current user data
  const dispatch = useDispatch()
  const user = useSelector(getUser)

  // Tracks the result of the latest save operation
  const [saveStatus, setSaveStatus] = useState(null)

  // Initialize form methods
  const {
    register,
    handleSubmit,
    reset,
  } = useForm()

  /**
   * Populate the form with the user's saved preferences.
   *
   * The form is reset whenever the preferences object changes,
   * keeping the displayed values synchronized with Redux state.
   */
  useEffect(() => {
    if (user?.preferences) {
      reset(user.preferences)
    }
  }, [user?.preferences, reset])

  /**
   * Submit updated preferences to the backend.
   *
   * Clears the previous save status before sending the request
   * and updates the status depending on whether the request succeeds.
   *
   * @param {Object} data - The submitted preferences form data.
   */
  const onSubmit = async data => {
    setSaveStatus(null)

    try {
      // Save the updated preferences through the profile update request
      await dispatch(updateProfileRequest({
        preferences: data,
      }))

      setSaveStatus('success')
    } catch (error) {
      // Display an error message if the save operation fails
      setSaveStatus('error')
    }
  }

  return (
    <div className={styles.root}>
      {/* Submit all preference changes through a single form */}
      <Form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
        <Container className={styles.container}>

          {/* Page heading */}
          <h1 className={styles.title}>Settings</h1>

          <Row className={styles.grid}>

            {/* LEFT COLUMN */}
            <Col xs="12" lg="6">

              {/* USER INTERFACE SETTINGS */}
              <div className={styles.section}>
                <h2>User Interface</h2>

                {/* Preferred application theme */}
                <div className={styles.row}>
                  <span>Theme</span>

                  <Form.Select {...register('ui.theme')}>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </Form.Select>
                </div>

                {/* Preferred application language */}
                <div className={styles.row}>
                  <span>Language</span>

                  <Form.Select {...register('ui.language')}>
                    <option value="en">English</option>
                    <option value="pl">Polish</option>
                  </Form.Select>
                </div>

                {/* Default layout for displaying content */}
                <div className={styles.row}>
                  <span>Default View</span>

                  <Form.Select {...register('ui.defaultView')}>
                    <option value="grid">Grid</option>
                    <option value="list">List</option>
                  </Form.Select>
                </div>

                {/* Enable or disable automatic playback */}
                <div className={styles.row}>
                  <span>Auto Play</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('ui.autoPlay')}
                  />
                </div>

                {/* Default sorting method for content */}
                <div className={styles.row}>
                  <span>Default Sort</span>

                  <Form.Select {...register('behavior.defaultSort')}>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                  </Form.Select>
                </div>
              </div>

              {/* CONTENT SETTINGS */}
              <div className={styles.section}>
                <h2>Content</h2>

                {/* Control whether NSFW content is displayed */}
                <div className={styles.row}>
                  <span>Show NSFW</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('content.showNsfw')}
                  />
                </div>

                {/* Control whether spoiler-related content is hidden */}
                <div className={styles.row}>
                  <span>Hide Spoilers</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('content.hideSpoilers')}
                  />
                </div>

                {/* Select preferred genres using multiple checkboxes */}
                <div className={`${styles.row} ${styles.genresRow}`}>
                  <span>Preferred Genres</span>

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
                <h2>Notifications</h2>

                {/* Enable or disable email notifications */}
                <div className={styles.row}>
                  <span>Email</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('notifications.email')}
                  />
                </div>

                {/* Enable or disable in-app notifications */}
                <div className={styles.row}>
                  <span>In App</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('notifications.inApp')}
                  />
                </div>

                {/* Enable or disable push notifications */}
                <div className={styles.row}>
                  <span>Push</span>

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
            <Button type="submit">Save</Button>

            {/* Navigate back to the home page */}
            <Button to="/">
              Back to home
            </Button>

            {/* Confirmation displayed after a successful save */}
            {saveStatus === 'success' && (
              <span className={styles.success}>
                Settings saved successfully.
              </span>
            )}

            {/* Error message displayed when saving fails */}
            {saveStatus === 'error' && (
              <span className={styles.error}>
                Failed to save settings.
              </span>
            )}
          </div>

        </Container>
      </Form>
    </div>
  )
}

export default Settings;