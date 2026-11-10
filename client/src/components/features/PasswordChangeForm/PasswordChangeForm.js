
/* =====================================================
   Password Change Form
   ===================================================== */

/**
 * @file PasswordChangeForm.js
 * @description Form component for changing the authenticated user's password.
 *              Handles password validation, submission, and feedback messages.
 */

/* =====================================================
   STYLES
   ===================================================== */

import styles from './PasswordChangeForm.module.scss'

/* =====================================================
   REACT HOOKS AND FORM MANAGEMENT
   ===================================================== */

import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

/* =====================================================
   UI COMPONENTS
   ===================================================== */

import { Form } from 'react-bootstrap'
import Button from '../../common/Button/Button'
import Container from '../../common/container/Container'

/* =====================================================
   REDUX STATE MANAGEMENT
   ===================================================== */

import { useDispatch } from 'react-redux'
import { updatePasswordRequest } from '../../../redux/reducers/userRedux'

/* =====================================================
   MESSAGE CONTEXT
   ===================================================== */

import { useMessage } from '../../../context/MessageContext'

/* =====================================================
   PASSWORD CHANGE FORM COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders an independent form for changing the user's password.
 *
 * @returns {JSX.Element} Password change form.
 */
const PasswordChangeForm = () => {
  /* =====================================================
     HOOKS AND INITIALIZATION
     ===================================================== */

  const { t } = useTranslation()
  const { showMessage } = useMessage()
  const dispatch = useDispatch()

  /* =====================================================
     PASSWORD FORM INITIALIZATION
     ===================================================== */

  /**
   * React Hook Form configuration for password fields.
   */
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  /* =====================================================
     PASSWORD UPDATE HANDLER
     ===================================================== */

  /**
   * Sends the validated password data to the backend.
   * Clears the form after a successful password update.
   *
   * @param {Object} data - Validated password form values.
   * @param {string} data.currentPassword - Current account password.
   * @param {string} data.newPassword - Requested new password.
   */
  const onSubmit = async (data) => {
    try {
      await dispatch(updatePasswordRequest({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }))

      // Clear password fields after a successful update.
      reset()

      // Display confirmation that the password was changed.
      await showMessage({
        title: t('common.success'),
        message: t('passwordChange.success'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (error) {
      // Display the server error message or a translated fallback.
      await showMessage({
        title: t('common.error'),
        message:
          error.response?.data?.message ||
          t('passwordChange.failed'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    }
  }

  /* =====================================================
     COMPONENT RENDER
     ===================================================== */

  return (
    <section className={styles.root}>
      <Container className={styles.container}>
        {/* Section heading */}
        <h2 className={styles.title}>
          {t('passwordChange.title')}
        </h2>

        {/* Password change form */}
        <Form onSubmit={handleSubmit(onSubmit)}>

          {/* Current password field */}
          <Form.Group className="mb-3">
            <Form.Label>
              {t('passwordChange.currentPassword')}
            </Form.Label>

            <Form.Control
              type="password"
              autoComplete="current-password"
              isInvalid={!!errors.currentPassword}
              {...register('currentPassword', {
                required: t('passwordChange.validation.currentRequired'),
              })}
            />

            <Form.Control.Feedback type="invalid">
              {errors.currentPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {/* New password field */}
          <Form.Group className="mb-3">
            <Form.Label>
              {t('passwordChange.newPassword')}
            </Form.Label>

            <Form.Control
              type="password"
              autoComplete="new-password"
              isInvalid={!!errors.newPassword}
              {...register('newPassword', {
                required: t('passwordChange.validation.newRequired'),
                minLength: {
                  value: 8,
                  message: t('passwordChange.validation.minLength'),
                },
                validate: (value) =>
                  value !== watch('currentPassword') ||
                  t('passwordChange.validation.mustBeDifferent'),
              })}
            />

            <Form.Control.Feedback type="invalid">
              {errors.newPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Confirm new password field */}
          <Form.Group className="mb-3">
            <Form.Label>
              {t('passwordChange.confirmPassword')}
            </Form.Label>

            <Form.Control
              type="password"
              autoComplete="new-password"
              isInvalid={!!errors.confirmPassword}
              {...register('confirmPassword', {
                required: t('passwordChange.validation.confirmRequired'),
                validate: (value) =>
                  value === watch('newPassword') ||
                  t('passwordChange.validation.passwordMismatch'),
              })}
            />

            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Submit password change request */}
          <Button
            type="submit"
            active={!isSubmitting}
          >
            {isSubmitting
              ? t('passwordChange.changing')
              : t('passwordChange.submit')}
          </Button>

        </Form>
      </Container>
    </section>
  )
}

export default PasswordChangeForm
