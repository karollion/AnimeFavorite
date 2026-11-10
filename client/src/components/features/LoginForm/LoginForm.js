
/* =====================================================
   Login Form
   ===================================================== */

/**
 * @file LoginForm.js
 * @description Form component responsible for user authentication.
 *              Handles login validation, submission, and feedback messages.
 */

/* =====================================================
   STYLES
   ===================================================== */

import styles from './LoginForm.module.scss'

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

/* =====================================================
   REDUX STATE MANAGEMENT
   ===================================================== */

import { useDispatch } from 'react-redux'
import { loginRequest } from '../../../redux/reducers/userRedux'

/* =====================================================
   ROUTING
   ===================================================== */

import { useNavigate } from 'react-router-dom'

/* =====================================================
   MESSAGE CONTEXT
   ===================================================== */

import { useMessage } from '../../../context/MessageContext'

/* =====================================================
   LOGIN FORM COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders the user login form.
 *
 * @param {Object} props
 * @param {string} [props.actionText] - Optional custom submit button label.
 *
 * @returns {JSX.Element} Login form.
 */
const LoginForm = ({ actionText }) => {
  /* =====================================================
     HOOKS AND INITIALIZATION
     ===================================================== */

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { t } = useTranslation()
  const { showMessage } = useMessage()

  /* =====================================================
     FORM INITIALIZATION
     ===================================================== */

  /**
   * React Hook Form configuration for login fields.
   */
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    defaultValues: {
      login: '',
      password: '',
    },
  })

  /* =====================================================
     LOGIN HANDLER
     ===================================================== */

  /**
   * Sends login credentials to the backend.
   * Redirects authenticated users to the home page.
   *
   * @param {Object} data - Validated login form values.
   * @param {string} data.login - User login.
   * @param {string} data.password - User password.
   */
  const onSubmit = async (data) => {
    try {
      await dispatch(loginRequest(data))

      // Redirect the user after successful authentication.
      navigate('/')
    } catch (error) {
      // Display an appropriate message depending on the error status.
      await showMessage({
        title: t('login.failedTitle'),
        message:
          error.response?.status === 401
            ? t('login.invalidCredentials')
            : t('login.failedMessage'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    }
  }

  /* =====================================================
     COMPONENT RENDER
     ===================================================== */

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.root}
    >
      {/* Login field */}
      <Form.Group className="mb-3">
        <Form.Label>
          {t('login.login')}
        </Form.Label>

        <Form.Control
          type="text"
          autoComplete="username"
          isInvalid={!!errors.login}
          placeholder={t('login.loginPlaceholder')}
          {...register('login', {
            required: t('login.validation.loginRequired'),
            minLength: {
              value: 3,
              message: t('login.validation.loginMinLength'),
            },
            maxLength: {
              value: 50,
              message: t('login.validation.loginMaxLength'),
            },
          })}
        />

        <Form.Control.Feedback type="invalid">
          {errors.login?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Password field */}
      <Form.Group className="mb-3">
        <Form.Label>
          {t('login.password')}
        </Form.Label>

        <Form.Control
          type="password"
          autoComplete="current-password"
          isInvalid={!!errors.password}
          placeholder={t('login.passwordPlaceholder')}
          {...register('password', {
            required: t('login.validation.passwordRequired'),
            minLength: {
              value: 3,
              message: t('login.validation.passwordMinLength'),
            },
            maxLength: {
              value: 50,
              message: t('login.validation.passwordMaxLength'),
            },
          })}
        />

        <Form.Control.Feedback type="invalid">
          {errors.password?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Form actions */}
      <div className={styles.buttons}>

        {/* Submit login credentials */}
        <Button
          type="submit"
          active={!isSubmitting}
        >
          {isSubmitting
            ? t('login.loggingIn')
            : actionText || t('login.submit')}
        </Button>

        {/* Redirect users who do not have an account */}
        <p>{t('login.noAccount')}</p>

        <Button to="/Signup">
          {t('common.signup')}
        </Button>

        {/* Return to the home page */}
        <Button to="/">
          {t('common.home')}
        </Button>

      </div>
    </Form>
  )
}

export default LoginForm
