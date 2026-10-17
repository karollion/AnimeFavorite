
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

import styles from './PasswordChangeForm.module.scss';

/* =====================================================
   REACT HOOKS AND FORM MANAGEMENT
   ===================================================== */

import { useState } from 'react';
import { useForm } from 'react-hook-form';

/* =====================================================
   UI COMPONENTS
   ===================================================== */

import { Form } from 'react-bootstrap';
import Button from '../../common/Button/Button';
import Container from '../../common/container/Container'

/* =====================================================
   REDUX STATE MANAGEMENT
   ===================================================== */

import { useDispatch } from 'react-redux';
import { updatePasswordRequest } from '../../../redux/reducers/userRedux';

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
     REDUX DISPATCH
     ===================================================== */

  /**
   * Dispatches the Redux action responsible for updating the password.
   */
  const dispatch = useDispatch();

  /* =====================================================
     LOCAL COMPONENT STATE
     ===================================================== */

  /**
   * Stores the success or error message displayed after submission.
   */
  const [passwordStatus, setPasswordStatus] = useState(null);

  /* =====================================================
     PASSWORD FORM INITIALIZATION
     ===================================================== */

  /**
   * React Hook Form configuration for password fields.
   *
   * @property {Function} register - Registers fields and validation rules.
   * @property {Function} handleSubmit - Validates and submits the form.
   * @property {Function} watch - Reads current password field values.
   * @property {Function} reset - Clears the form after successful submission.
   * @property {Object} errors - Contains password validation errors.
   * @property {boolean} isSubmitting - Indicates an active submission.
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
  });

  /* =====================================================
     PASSWORD UPDATE HANDLER
     ===================================================== */

  /**
   * Sends the validated password data to the backend.
   * Clears the fields on success and displays feedback.
   *
   * @param {Object} data - Validated password form values.
   * @param {string} data.currentPassword - Current account password.
   * @param {string} data.newPassword - Requested new password.
   */
  const onSubmit = async data => {
    setPasswordStatus(null);

    try {
      await dispatch(updatePasswordRequest({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }));

      // Clear password fields after a successful update.
      reset();

      // Display confirmation that the password was changed.
      setPasswordStatus({
        type: 'success',
        message: 'Hasło zostało zmienione.',
      });
    } catch (error) {
      // Display the server error message or a fallback message.
      setPasswordStatus({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Nie udało się zmienić hasła.',
      });
    }
  };

  /* =====================================================
     COMPONENT RENDER
     ===================================================== */

  return (
    <section className={styles.root}>
        <Container className={styles.container}>
      {/* Section heading */}
      <h2 className={styles.title}>Change Password</h2>

      {/* Password change form */}
      <Form onSubmit={handleSubmit(onSubmit)}>

        {/* Current password field */}
        <Form.Group className="mb-3">
          <Form.Label>Current password</Form.Label>

          <Form.Control
            type="password"
            autoComplete="current-password"
            isInvalid={!!errors.currentPassword}
            {...register('currentPassword', {
              required: 'Podaj aktualne hasło.',
            })}
          />

          <Form.Control.Feedback type="invalid">
            {errors.currentPassword?.message}
          </Form.Control.Feedback>
        </Form.Group>

        {/* New password field with length and difference validation */}
        <Form.Group className="mb-3">
          <Form.Label>New password</Form.Label>

          <Form.Control
            type="password"
            autoComplete="new-password"
            isInvalid={!!errors.newPassword}
            {...register('newPassword', {
              required: 'Podaj nowe hasło.',
              minLength: {
                value: 8,
                message: 'Hasło musi mieć co najmniej 8 znaków.',
              },
              validate: value =>
                value !== watch('currentPassword') ||
                'Nowe hasło musi różnić się od aktualnego.',
            })}
          />

          <Form.Control.Feedback type="invalid">
            {errors.newPassword?.message}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Confirm new password and check that both values match */}
        <Form.Group className="mb-3">
          <Form.Label>Confirm new password</Form.Label>

          <Form.Control
            type="password"
            autoComplete="new-password"
            isInvalid={!!errors.confirmPassword}
            {...register('confirmPassword', {
              required: 'Potwierdź nowe hasło.',
              validate: value =>
                value === watch('newPassword') ||
                'Hasła nie są identyczne.',
            })}
          />

          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword?.message}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Password update success or error feedback */}
        {passwordStatus && (
          <p
            className={
              passwordStatus.type === 'success'
                ? styles.success
                : styles.error
            }
            role={passwordStatus.type === 'success' ? 'status' : 'alert'}
          >
            {passwordStatus.message}
          </p>
        )}

        {/* Submit the password change request */}
        <Button
          type="submit"
          active={!isSubmitting}
        >
          {isSubmitting ? 'Changing...' : 'Change Password'}
        </Button>

      </Form>
      </Container>
    </section>
  );
};

export default PasswordChangeForm;
