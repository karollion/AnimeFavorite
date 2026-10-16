/* =====================================================
   Profile Edit Page
   ===================================================== */

/**
 * @file ProfileEdit.js
 * @description Page component for editing the authenticated user's profile.
 *              Provides separate forms for updating profile information,
 *              uploading an avatar, and changing the account password.
 *              Uses React Hook Form for form management and validation,
 *              Redux for user data operations, and local state for
 *              save status, avatar handling, and password feedback.
 */

/* =====================================================
   STYLES
   ===================================================== */

import styles from './ProfileEdit.module.scss'

/* =====================================================
   REACT HOOKS AND FORM MANAGEMENT
   ===================================================== */

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

/* =====================================================
   UI COMPONENTS
   ===================================================== */

import { Row, Col, Form } from 'react-bootstrap'
import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'
import ImageUpload from '../../features/ImageUpload/ImageUpload';

/* =====================================================
   REDUX STATE MANAGEMENT
   ===================================================== */

import { useDispatch, useSelector } from 'react-redux'
import {
  getUser,
  updateProfileRequest,
  updateAvatarRequest,
  updatePasswordRequest,
} from '../../../redux/reducers/userRedux'

/* =====================================================
   PROFILE EDIT COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders the profile editing page for the authenticated user.
 *              Supports updating personal information, uploading an avatar,
 *              and changing the account password.
 *
 * @returns {JSX.Element} The profile editing page.
 */
const ProfileEdit = () => {

  /* =====================================================
     REDUX STATE AND DISPATCH
     ===================================================== */

  /**
   * Redux dispatch function used to trigger profile update actions.
   */
  const dispatch = useDispatch()

  /**
   * Currently authenticated user's profile data.
   */
  const user = useSelector(getUser)

  /* =====================================================
     LOCAL COMPONENT STATE
     ===================================================== */
     
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [passwordStatus, setPasswordStatus] = useState(null)
  const currentYear = new Date().getFullYear()

  /* =====================================================
     PROFILE FORM INITIALIZATION
     ===================================================== */

  /**
   * React Hook Form configuration for editing profile information.
   *
   * @property {Function} register - Registers fields and validation rules.
   * @property {Function} handleSubmit - Validates and submits the form.
   * @property {Function} reset - Resets the form values and dirty state.
   * @property {Object} errors - Validation errors for profile fields.
   * @property {boolean} isDirty - Indicates whether registered fields changed.
   */
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isDirty,
    },
  } = useForm({
    defaultValues: {
      email: '',
      birth_year: '',
      description: '',
    },
  })

  /* =====================================================
     PASSWORD FORM INITIALIZATION
     ===================================================== */

  /**
   * React Hook Form configuration for changing the account password.
   *
   * @property {Function} registerPassword - Registers password fields.
   * @property {Function} handlePasswordSubmit - Validates and submits the form.
   * @property {Function} watchPassword - Retrieves current password field values.
   * @property {Function} resetPassword - Clears the password form.
   * @property {Object} passwordErrors - Validation errors for password fields.
   * @property {boolean} isChangingPassword - Indicates whether submission is active.
   */
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    reset: resetPassword,
    formState: {
      errors: passwordErrors,
      isSubmitting: isChangingPassword,
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
   * Handles password change form submission.
   * Dispatches the password update request, clears the form on success,
   * and stores a success or error message for the user.
   *
   * @param {Object} data - Validated password form values.
   * @param {string} data.currentPassword - Current account password.
   * @param {string} data.newPassword - Requested new password.
   */
  const onPasswordSubmit = async data => {
    setPasswordStatus(null)

    try {
      await dispatch(updatePasswordRequest({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }))

      // Clear password fields after a successful update.
      resetPassword()

      // Display confirmation that the password was changed.
      setPasswordStatus({
        type: 'success',
        message: 'Hasło zostało zmienione.',
      })
    } catch (error) {
      // Display the server error message or a fallback message.
      setPasswordStatus({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Nie udało się zmienić hasła.',
      })
    }
  }

  /* =====================================================
     PROFILE DATA SYNCHRONIZATION
     ===================================================== */

  /**
   * Synchronizes profile form values with the current Redux user data.
   * Resets avatar selection and previous feedback when user data changes.
   *
   * @dependency user - Current authenticated user's profile data.
   * @dependency reset - React Hook Form function for resetting field values.
   */
  useEffect(() => {
    if (!user) return

    reset({
      email: user.email || '',
      birth_year: user.birth_year ?? '',
      description: user.description || '',
    })

    // Clear temporary avatar selection and previous feedback.
    setSaveStatus(null)
  }, [user, reset])

  /* =====================================================
     PROFILE UPDATE HANDLER
     ===================================================== */

  /**
   * Handles profile form submission.
   * Updates profile fields only when they have changed and uploads
   * the selected avatar separately through its dedicated request.
   *
   * @param {Object} data - Validated profile form values.
   * @param {string} data.email - Updated email address.
   * @param {string | number} data.birth_year - Selected birth year.
   * @param {string} data.description - Updated profile description.
   */
  const onSubmit = async data => {
    setSaveStatus(null);
    setIsSaving(true);

    try {
      if (isDirty) {
        await dispatch(updateProfileRequest({
          email: data.email.trim(),
          birth_year: data.birth_year === ''
            ? null
            : Number(data.birth_year),
          description: data.description.trim(),
        }));
      }

      setSaveStatus('success');
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  /* =====================================================
   AVATAR UPLOAD HANDLER
   ===================================================== */

  /**
   * Uploads a new avatar independently of profile information.
   *
   * @param {File} file - Selected avatar image.
   */
  const handleAvatarUpload = async file => {
    setIsUploadingAvatar(true);

    try {
      await dispatch(updateAvatarRequest(file));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  /* =====================================================
     AUTHENTICATION GUARD
     ===================================================== */

  /**
   * Prevents profile editing when no authenticated user is available.
   * Displays a message asking the visitor to log in.
   */
  if (!user) {
    return (
      <div className={styles.root}>
        <Container className={styles.container}>
          <h1 className={styles.title}>Edit Profile</h1>
          <p>Please log in to edit your profile.</p>
        </Container>
      </div>
    )
  }

  /* =====================================================
     PROFILE EDIT FORM
     ===================================================== */

  return (
    <div className={styles.root}>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.root}
      >
        <Container className={styles.container}>

          {/* Page heading */}
          <h1 className={styles.title}>Edit Profile</h1>

          <Row className={styles.grid}>
            <Col xs="12" lg="12">

              {/* =====================================================
                  AVATAR MANAGEMENT
                  ===================================================== */}

              <ImageUpload
                title="Avatar"
                label="Choose a new avatar"
                currentImage={user.avatar}
                currentImageAlt={`${user.login}'s avatar`}
                onUpload={handleAvatarUpload}
                isUploading={isUploadingAvatar}
                maxSizeMB={5}
                uploadButtonLabel="Upload avatar"
                successMessage="Avatar updated successfully."
              />

              {/* =====================================================
                  EMAIL FIELD
                  ===================================================== */}

              {/* Editable email address with required, length, and format validation. */}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>

                <Form.Control
                  type="email"
                  autoComplete="email"
                  isInvalid={!!errors.email}
                  {...register('email', {
                    required: 'Email is required.',
                    maxLength: {
                      value: 254,
                      message: 'Email is too long.',
                    },
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Enter a valid email address.',
                    },
                  })}
                  placeholder="Enter email"
                />

                {/* Email validation feedback */}
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              {/* =====================================================
                  BIRTH YEAR FIELD
                  ===================================================== */}

              {/* Selects a birth year between 1900 and the current year. */}
              <Form.Group className="mb-3">
                <Form.Label>Birth year</Form.Label>

                <Form.Select
                  isInvalid={!!errors.birth_year}
                  {...register('birth_year', {
                    validate: value =>
                      value === '' ||
                      (
                        Number.isInteger(Number(value)) &&
                        Number(value) >= 1900 &&
                        Number(value) <= currentYear
                      ) ||
                      'Select a valid birth year.',
                  })}
                >
                  {/* Allows the user to leave the birth year unspecified. */}
                  <option value="">Not specified</option>

                  {/* Generates year options in descending order. */}
                  {Array.from(
                    { length: currentYear - 1900 + 1 },
                    (_, i) => currentYear - i
                  ).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>

                {/* Birth year validation feedback */}
                <Form.Control.Feedback type="invalid">
                  {errors.birth_year?.message}
                </Form.Control.Feedback>
              </Form.Group>

              {/* =====================================================
                  PROFILE DESCRIPTION
                  ===================================================== */}

              {/* Editable user description with a 1000-character limit. */}
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={4}
                  maxLength={1000}
                  isInvalid={!!errors.description}
                  {...register('description', {
                    maxLength: {
                      value: 1000,
                      message: 'Description cannot exceed 1000 characters.',
                    },
                  })}
                  placeholder="Tell us something about yourself"
                />

                {/* Description length guidance */}
                <div className="d-flex justify-content-between">
                  <Form.Text>
                    Maximum 1000 characters.
                  </Form.Text>
                </div>

                {/* Description validation feedback */}
                {errors.description && (
                  <small className="text-danger">
                    {errors.description.message}
                  </small>
                )}
              </Form.Group>

            </Col>
          </Row>

          {/* =====================================================
              PROFILE SAVE ACTION
              ===================================================== */}

          {/* Submits profile changes and displays the current saving state. */}
          <div className={styles.actions}>
            <Button type="submit" active={!isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>

          {/* Profile update success feedback */}
          {saveStatus === 'success' && (
            <p className={styles.success} role="status">
              Profile updated successfully.
            </p>
          )}

          {/* Profile update error feedback */}
          {saveStatus === 'error' && (
            <p className={styles.error} role="alert">
              Failed to save profile. Check your data and try again.
            </p>
          )}

        </Container>
      </Form>

      {/* =====================================================
          PASSWORD CHANGE SECTION
          ===================================================== */}

      <section className={styles.passwordSection}>
        <h2>Change Password</h2>

        {/* Separate form for updating account credentials */}
        <Form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>

          {/* Current password field */}
          <Form.Group className="mb-3">
            <Form.Label>Current password</Form.Label>

            <Form.Control
              type="password"
              autoComplete="current-password"
              {...registerPassword('currentPassword', {
                required: 'Podaj aktualne hasło.',
              })}
              isInvalid={!!passwordErrors.currentPassword}
            />

            <Form.Control.Feedback type="invalid">
              {passwordErrors.currentPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {/* New password field with length and difference validation */}
          <Form.Group className="mb-3">
            <Form.Label>New password</Form.Label>

            <Form.Control
              type="password"
              autoComplete="new-password"
              {...registerPassword('newPassword', {
                required: 'Podaj nowe hasło.',
                minLength: {
                  value: 8,
                  message: 'Hasło musi mieć co najmniej 8 znaków.',
                },
                validate: value =>
                  value !== watchPassword('currentPassword') ||
                  'Nowe hasło musi różnić się od aktualnego.',
              })}
              isInvalid={!!passwordErrors.newPassword}
            />

            <Form.Control.Feedback type="invalid">
              {passwordErrors.newPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Confirms the new password and checks that both values match */}
          <Form.Group className="mb-3">
            <Form.Label>Confirm new password</Form.Label>

            <Form.Control
              type="password"
              autoComplete="new-password"
              {...registerPassword('confirmPassword', {
                required: 'Potwierdź nowe hasło.',
                validate: value =>
                  value === watchPassword('newPassword') ||
                  'Hasła nie są identyczne.',
              })}
              isInvalid={!!passwordErrors.confirmPassword}
            />

            <Form.Control.Feedback type="invalid">
              {passwordErrors.confirmPassword?.message}
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
              role="status"
            >
              {passwordStatus.message}
            </p>
          )}

          {/* Submits the password change request */}
          <Button
            type="submit"
            active={!isChangingPassword}
          >
            {isChangingPassword ? 'Changing...' : 'Change Password'}
          </Button>

        </Form>
      </section>

      {/* =====================================================
          PAGE NAVIGATION
          ===================================================== */}

      {/* Navigation back to the home page */}
      <div className={styles.actions}>
        <Button to="/">
          Back to home
        </Button>
      </div>

    </div>
  )
}

export default ProfileEdit