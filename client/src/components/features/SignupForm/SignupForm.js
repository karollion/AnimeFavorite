
/* =====================================================
   COMPONENTS
   ===================================================== */

import styles from './SignupForm.module.scss';

import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Button from '../../common/Button/Button';

import { registerRequest } from '../../../redux/reducers/userRedux';
import { useMessage } from '../../../context/MessageContext';

/* =====================================================
   SIGNUP FORM COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders the user registration form.
 *              Handles form validation, account creation and
 *              registration success or error messages.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.actionText - Custom registration button label.
 *
 * @returns {JSX.Element} The rendered signup form.
 */
const SignupForm = ({ actionText }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { showMessage } = useMessage();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({});

  /* =====================================================
     FORM SUBMISSION
     ===================================================== */

  /**
   * Registers a new user account.
   * Displays a success message or an error message depending
   * on the result of the registration request.
   *
   * @param {Object} data - Submitted registration form values.
   */
  const onSubmit = async data => {
    try {
      await dispatch(
        registerRequest({
          login: data.login,
          password: data.password,
          email: data.email,
          birth_year: Number(data.birth_year),
        })
      );

      await showMessage({
        title: t('common.success'),
        message: t('signup.registerSuccess'),
        mode: 'alert',
        confirmText: t('common.ok'),
      });

      navigate('/Login');

    } catch (error) {
      await showMessage({
        title: t('common.error'),
        message:
          error.response?.data?.message ||
          t('signup.registerFailed'),
        mode: 'alert',
        confirmText: t('common.ok'),
      });
    }
  };

  /* =====================================================
     PAGE DATA
     ===================================================== */

  // Generate the list of available birth years.
  const currentYear = new Date().getFullYear();

  const birthYears = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, index) => currentYear - index
  );

  /* =====================================================
     FORM LAYOUT
     ===================================================== */

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.root}
    >

      {/* =====================================================
         EMAIL
         ===================================================== */}

      <Form.Group className="mb-3">
        <Form.Label>
          {t('signup.email')}
        </Form.Label>

        <Form.Control
          type="email"
          {...register('email', {
            required: t('signup.validation.emailRequired'),
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: t('signup.validation.emailInvalid'),
            },
          })}
          placeholder={t('signup.emailPlaceholder')}
        />

        {errors.email && (
          <small className="text-danger">
            {errors.email.message}
          </small>
        )}
      </Form.Group>

      {/* =====================================================
         LOGIN
         ===================================================== */}

      <Form.Group className="mb-3">
        <Form.Label>
          {t('signup.login')}
        </Form.Label>

        <Form.Control
          {...register('login', {
            required: t('signup.validation.loginRequired'),
            minLength: {
              value: 3,
              message: t('signup.validation.loginMinLength'),
            },
            maxLength: {
              value: 30,
              message: t('signup.validation.loginMaxLength'),
            },
          })}
          placeholder={t('signup.loginPlaceholder')}
        />

        {errors.login && (
          <small className="text-danger">
            {errors.login.message}
          </small>
        )}
      </Form.Group>

      {/* =====================================================
         PASSWORD
         ===================================================== */}

      <Form.Group className="mb-3">
        <Form.Label>
          {t('signup.password')}
        </Form.Label>

        <Form.Control
          type="password"
          {...register('password', {
            required: t('signup.validation.passwordRequired'),
            minLength: {
              value: 7,
              message: t('signup.validation.passwordMinLength'),
            },
            maxLength: {
              value: 30,
              message: t('signup.validation.passwordMaxLength'),
            },
          })}
          placeholder={t('signup.passwordPlaceholder')}
        />

        {errors.password && (
          <small className="text-danger">
            {errors.password.message}
          </small>
        )}

        <p>
          {t('signup.passwordLength')}
        </p>
      </Form.Group>

      {/* =====================================================
         CONFIRM PASSWORD
         ===================================================== */}

      <Form.Group className="mb-3">
        <Form.Label>
          {t('signup.confirmPassword')}
        </Form.Label>

        <Form.Control
          type="password"
          {...register('confirmPassword', {
            required: t('signup.validation.confirmPasswordRequired'),
            validate: value =>
              value === watch('password') ||
              t('signup.validation.passwordMismatch'),
          })}
          placeholder={t('signup.confirmPasswordPlaceholder')}
        />

        {errors.confirmPassword && (
          <small className="text-danger">
            {errors.confirmPassword.message}
          </small>
        )}

        <p>
          {t('signup.passwordLength')}
        </p>
      </Form.Group>

      {/* =====================================================
         BIRTH YEAR
         ===================================================== */}

      <Form.Group className="mb-3">
        <Form.Label>
          {t('signup.birthYear')}
        </Form.Label>

        <Form.Select
          {...register('birth_year', {
            required: t('signup.validation.birthYearRequired'),
          })}
        >
          <option value="">
            {t('signup.birthYearPlaceholder')}
          </option>

          {birthYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Form.Select>

        {errors.birth_year && (
          <small className="text-danger">
            {errors.birth_year.message}
          </small>
        )}
      </Form.Group>

      {/* =====================================================
         ACTIONS
         ===================================================== */}

      <div className={styles.buttons}>
        <Button type="submit">
          {actionText || t('signup.submit')}
        </Button>

        <p>
          {t('signup.alreadyHaveAccount')}
        </p>

        <Button to="/Login">
          {t('common.login')}
        </Button>

        <Button to="/">
          {t('common.home')}
        </Button>
      </div>

    </Form>
  );
};

/* =====================================================
   PROP TYPES
   ===================================================== */

SignupForm.propTypes = {
  actionText: PropTypes.string,
};

export default SignupForm;
