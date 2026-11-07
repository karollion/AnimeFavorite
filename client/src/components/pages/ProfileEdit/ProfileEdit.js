
/**
 * @file ProfileEdit.js
 * @description Page component for editing the authenticated user's profile.
 *              Supports profile information updates, avatar uploads,
 *              and password changes.
 */

// Styles
import styles from './ProfileEdit.module.scss'

// React
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Form management
import { useForm } from 'react-hook-form'

// UI components
import { Row, Col, Form } from 'react-bootstrap'
import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'
import ImageUpload from '../../features/ImageUpload/ImageUpload'
import PasswordChangeForm from '../../features/PasswordChangeForm/PasswordChangeForm'

// Redux
import {
  getUser,
  updateProfileRequest,
  updateAvatarRequest,
} from '../../../redux/reducers/userRedux'

// Translations and messages
import { useTranslation } from 'react-i18next'
import { useMessage } from '../../../context/MessageContext'

const ProfileEdit = () => {
  // Translations and global message handling.
  const { t } = useTranslation()
  const { showMessage } = useMessage()

  // Redux state and dispatch.
  const dispatch = useDispatch()
  const user = useSelector(getUser)

  // Local component state.
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const currentYear = new Date().getFullYear()

  // Profile form configuration.
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

  /**
   * Synchronizes form values with the authenticated user's data.
   * Resetting the form also clears its dirty state.
   */
  useEffect(() => {
    if (!user) return

    reset({
      email: user.email || '',
      birth_year: user.birth_year ?? '',
      description: user.description || '',
    })
  }, [user, reset])

  /**
   * Updates the user's profile information.
   * The request is skipped when no fields have been changed.
   *
   * @param {Object} data - Validated profile form values.
   */
  const onSubmit = async data => {
    if (!isDirty) return

    setIsSaving(true)

    try {
      await dispatch(updateProfileRequest({
        email: data.email.trim(),
        birth_year: data.birth_year === ''
          ? null
          : Number(data.birth_year),
        description: data.description.trim(),
      }))

      await showMessage({
        title: t('common.success'),
        message: t('profileEdit.saveSuccess'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (error) {
      await showMessage({
        title: t('common.error'),
        message: t('profileEdit.saveFailed'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Uploads a new avatar independently of the profile form.
   *
   * @param {File} file - Selected avatar image.
   */
  const handleAvatarUpload = async file => {
    setIsUploadingAvatar(true)

    try {
      await dispatch(updateAvatarRequest(file))
    } catch (error) {
      await showMessage({
        title: t('common.error'),
        message: t('profileEdit.avatarUploadFailed'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })

      // Propagate the error so the ImageUpload component can handle
      // the failed upload instead of treating it as successful.
      throw error
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  // Authentication guard.
  if (!user) {
    return (
      <div className={styles.root}>
        <Container className={styles.container}>
          <h1 className={styles.title}>
            {t('profileEdit.title')}
          </h1>

          <p>{t('profileEdit.loginRequired')}</p>
        </Container>
      </div>
    )
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
            {t('profileEdit.title')}
          </h1>

          <Row className={styles.grid}>
            <Col xs="12" lg="12">

              {/* Avatar management */}
              <ImageUpload
                title={t('profileEdit.avatarTitle')}
                label={t('profileEdit.chooseAvatar')}
                currentImage={user.avatar}
                currentImageAlt={t('profileEdit.avatarAlt', {
                  login: user.login,
                })}
                onUpload={handleAvatarUpload}
                isUploading={isUploadingAvatar}
                maxSizeMB={5}
                uploadButtonLabel={t('profileEdit.uploadAvatar')}
                successMessage={t('profileEdit.avatarUploadSuccess')}
              />

              {/* Email address */}
              <Form.Group className="mb-3">
                <Form.Label>
                  {t('profileEdit.email')}
                </Form.Label>

                <Form.Control
                  type="email"
                  autoComplete="email"
                  isInvalid={!!errors.email}
                  {...register('email', {
                    required: true,
                    maxLength: {
                      value: 254,
                    },
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                    },
                  })}
                  placeholder={t('profileEdit.emailPlaceholder')}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.email?.type === 'required' &&
                    t('profileEdit.validation.emailRequired')}

                  {errors.email?.type === 'maxLength' &&
                    t('profileEdit.validation.emailTooLong')}

                  {errors.email?.type === 'pattern' &&
                    t('profileEdit.validation.emailInvalid')}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Birth year */}
              <Form.Group className="mb-3">
                <Form.Label>
                  {t('profileEdit.birthYear')}
                </Form.Label>

                <Form.Select
                  isInvalid={!!errors.birth_year}
                  {...register('birth_year', {
                    validate: value =>
                      value === '' ||
                      (
                        Number.isInteger(Number(value)) &&
                        Number(value) >= 1900 &&
                        Number(value) <= currentYear
                      ),
                  })}
                >
                  {/* Allows the user to leave the birth year unspecified. */}
                  <option value="">
                    {t('profileEdit.notSpecified')}
                  </option>

                  {/* Generates year options in descending order. */}
                  {Array.from(
                    { length: currentYear - 1900 + 1 },
                    (_, index) => currentYear - index
                  ).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>

                <Form.Control.Feedback type="invalid">
                  {t('profileEdit.validation.birthYearInvalid')}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Profile description */}
              <Form.Group className="mb-3">
                <Form.Label>
                  {t('profileEdit.description')}
                </Form.Label>

                <Form.Control
                  as="textarea"
                  rows={4}
                  maxLength={1000}
                  isInvalid={!!errors.description}
                  {...register('description', {
                    maxLength: {
                      value: 1000,
                    },
                  })}
                  placeholder={t('profileEdit.descriptionPlaceholder')}
                />

                <div className="d-flex justify-content-between">
                  <Form.Text>
                    {t('profileEdit.descriptionLimit')}
                  </Form.Text>
                </div>

                <Form.Control.Feedback type="invalid">
                  {t('profileEdit.validation.descriptionTooLong')}
                </Form.Control.Feedback>
              </Form.Group>

            </Col>
          </Row>

          {/* Profile save action */}
          <div className={styles.actions}>
            <Button
              type="submit"
              active={!isSaving && isDirty}
            >
              {isSaving
                ? t('profileEdit.saving')
                : t('profileEdit.saveChanges')}
            </Button>
          </div>

        </Container>
      </Form>

      {/* Password change section */}
      <PasswordChangeForm />

      {/* Navigation */}
      <div className={styles.actions}>
        <Button to="/">
          {t('common.home')}
        </Button>
      </div>
    </div>
  )
}

export default ProfileEdit
