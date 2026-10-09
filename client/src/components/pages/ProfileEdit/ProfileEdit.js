import styles from './ProfileEdit.module.scss'
import { Row, Col, Form } from 'react-bootstrap'
import Container from '../../common/container/Container';
import Button from '../../common/Button/Button';
import { getUser, updateProfileRequest } from '../../../redux/reducers/userRedux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const [saveStatus, setSaveStatus] = useState(null);

  const {
    edit,
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const onSubmit = async data => {
    setSaveStatus(null);

    try {
      await dispatch(updateProfileRequest({
        user: data,
      }));

      setSaveStatus('success');
    } catch (error) {
      setSaveStatus('error');
    }
  };

  return (
    <div className={styles.root}>
      <Form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
        <Container className={styles.container}>
          <h1 className={styles.title}>Settings</h1>

          <Row className={styles.grid}>
            <Col xs="12" lg="6">

              {/* Avatar */}
              <Form.Group className="mb-4">
                <Form.Label>Avatar</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  {...edit('avatar', {
                    validate: files =>
                      !files?.length ||
                      ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type),
                  })}
                />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  {...edit('email', {
                    required: true,
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <small className="text-danger">
                    {errors.email.message || 'Email is required'}
                  </small>
                )}
              </Form.Group>

              {/* BIRTH YEAR */}
              <Form.Group className="mb-3">
                <Form.Label>Birth year</Form.Label>
                <Form.Select
                  {...edit('birth_year', { required: true })}
                >
                  <option value="">Select birth year</option>
            
                  {Array.from(
                    { length: new Date().getFullYear() - 1900 + 1 },
                    (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    }
                  )}
                </Form.Select>
                
                {errors.birth_year && (
                  <small className="text-danger">Birth year is required</small>
                )}
              </Form.Group>

              {/* DESCRIPTION */}
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  {...edit('description', { maxLength: 1000 })}
                />
                {errors.description && <small className="text-danger">Description is to long</small>}
                <p>(Max 1000 characters)</p>
              </Form.Group>

            </Col>
          </Row>

          <div className={styles.actions}>
            <Button type="submit">Save</Button>
            
            <Button to="/">
              Back to home
            </Button>
            
            {saveStatus === 'success' && (
              <span className={styles.success}>
                User data saved successfully.
              </span>
            )}
          
            {saveStatus === 'error' && (
              <span className={styles.error}>
                Failed to save user data.
              </span>
            )}
          </div>
        </Container>
      </Form>
    </div>
  );
};

export default ProfileEdit;