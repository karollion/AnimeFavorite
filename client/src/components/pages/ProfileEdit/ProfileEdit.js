
import styles from './ProfileEdit.module.scss';

import { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Container from '../../common/container/Container';
import Button from '../../common/Button/Button';

import {
  getUser,
  updateProfileRequest,
  updateAvatarRequest,
  updatePasswordRequest,
} from '../../../redux/reducers/userRedux';

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  const [saveStatus, setSaveStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarError, setAvatarError] = useState('');
  const [passwordStatus, setPasswordStatus] = useState(null);

  const currentYear = new Date().getFullYear();

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
  });

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
  });

  const onPasswordSubmit = async data => {
    setPasswordStatus(null);
    
    try {
      await dispatch(updatePasswordRequest({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }));
    
      resetPassword();
      setPasswordStatus({
        type: 'success',
        message: 'Hasło zostało zmienione.',
      });
    } catch (error) {
      setPasswordStatus({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Nie udało się zmienić hasła.',
      });
    }
  };

  useEffect(() => {
    if (!user) return;

    reset({
      email: user.email || '',
      birth_year: user.birth_year ?? '',
      description: user.description || '',
    });

    setAvatarFile(null);
    setAvatarError('');
    setSaveStatus(null);
  }, [user, reset]);

  const onSubmit = async data => {
    setSaveStatus(null);
    setAvatarError('');
    setIsSaving(true);

    try {
      // Save profile fields only when they have changed.
      if (isDirty) {
        await dispatch(updateProfileRequest({
          email: data.email.trim(),
          birth_year: data.birth_year === ''
            ? null
            : Number(data.birth_year),
          description: data.description.trim(),
        }));
      }

      // Avatar uses its own endpoint and multipart/form-data.
      if (avatarFile) {
        await dispatch(updateAvatarRequest(avatarFile));
      }

      setSaveStatus('success');
      setAvatarFile(null);
      setAvatarError('');
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const avatarInput = register('avatar', {
    validate: files => {
      if (!files?.length) return true;

      const file = files[0];
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
      ];

      if (!allowedTypes.includes(file.type)) {
        return 'Choose a JPG, PNG or WebP image.';
      }

      if (file.size > 5 * 1024 * 1024) {
        return 'The image must be smaller than 5 MB.';
      }

      return true;
    },
  });

  if (!user) {
    return (
      <div className={styles.root}>
        <Container className={styles.container}>
          <h1 className={styles.title}>Edit Profile</h1>
          <p>Please log in to edit your profile.</p>
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.root}
      >
        <Container className={styles.container}>
          <h1 className={styles.title}>Edit Profile</h1>

          <Row className={styles.grid}>
            <Col xs="12" lg="12">

              {/* Current avatar */}
              <Form.Group className="mb-4">
                <Form.Label>Current avatar</Form.Label>

                {user.avatar ? (
                  <div className={styles.avatarPreview}>
                    <img
                      src={user.avatar}
                      alt={`${user.login}'s avatar`}
                    />
                  </div>
                ) : (
                  <p>No avatar uploaded.</p>
                )}

                <Form.Label className="mt-3">
                  Change avatar
                </Form.Label>

                <Form.Control
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  name={avatarInput.name}
                  ref={avatarInput.ref}
                  onBlur={avatarInput.onBlur}
                  onChange={event => {
                    avatarInput.onChange(event);
                    setAvatarFile(event.target.files?.[0] || null);
                    setAvatarError('');
                    setSaveStatus(null);
                  }}
                />

                {errors.avatar && (
                  <small className="text-danger">
                    {errors.avatar.message}
                  </small>
                )}

                <Form.Text>
                  JPG, PNG or WebP. Maximum size: 5 MB.
                </Form.Text>
              </Form.Group>

              {/* Email */}
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

                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Birth year */}
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
                  <option value="">Not specified</option>

                  {Array.from(
                    { length: currentYear - 1900 + 1 },
                    (_, i) => currentYear - i
                  ).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>

                <Form.Control.Feedback type="invalid">
                  {errors.birth_year?.message}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Description */}
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

                <div className="d-flex justify-content-between">
                  <Form.Text>
                    Maximum 1000 characters.
                  </Form.Text>
                </div>

                {errors.description && (
                  <small className="text-danger">
                    {errors.description.message}
                  </small>
                )}
              </Form.Group>
            </Col>
          </Row>

          <div className={styles.actions}>
            <Button type="submit" active={!isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>

          {saveStatus === 'success' && (
            <p className={styles.success} role="status">
              Profile updated successfully.
            </p>
          )}

          {saveStatus === 'error' && (
            <p className={styles.error} role="alert">
              Failed to save profile. Check your data and try again.
            </p>
          )}
        </Container>
      </Form>
      <section className={styles.passwordSection}>
         <h2>Change Password</h2>
         <Form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
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
           <Button
             type="submit"
             active={!isChangingPassword}
           >
             {isChangingPassword ? 'Changing...' : 'Change Password'}
           </Button>
         </Form>
       </section>

       <div className={styles.actions}>
         <Button to="/">
           Back to home
         </Button>
       </div>
    </div>
  );
};

export default ProfileEdit;