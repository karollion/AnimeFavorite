import styles from './Settings.module.scss'
import { Row, Col, Form } from 'react-bootstrap'
import Container from '../../common/container/Container';
import Button from '../../common/Button/Button';
import { getUser, updateProfileRequest } from '../../../redux/reducers/userRedux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const [saveStatus, setSaveStatus] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    if (user?.preferences) {
      reset(user.preferences);
    }
  }, [user?.preferences, reset]);

  const onSubmit = async data => {
    setSaveStatus(null);

    try {
      await dispatch(updateProfileRequest({
        preferences: data,
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

            {/* LEFT COLUMN */}
            <Col xs="12" lg="6">

              {/* USER INTERFACE */}
              <div className={styles.section}>
                <h2>User Interface</h2>

                <div className={styles.row}>
                  <span>Theme</span>

                  <Form.Select {...register('ui.theme')}>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </Form.Select>
                </div>

                <div className={styles.row}>
                  <span>Language</span>

                  <Form.Select {...register('ui.language')}>
                    <option value="en">English</option>
                    <option value="pl">Polish</option>
                  </Form.Select>
                </div>

                <div className={styles.row}>
                  <span>Default View</span>

                  <Form.Select {...register('ui.defaultView')}>
                    <option value="grid">Grid</option>
                    <option value="list">List</option>
                  </Form.Select>
                </div>

                <div className={styles.row}>
                  <span>Auto Play</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('ui.autoPlay')}
                  />
                </div>

                <div className={styles.row}>
                  <span>Default Sort</span>

                  <Form.Select {...register('behavior.defaultSort')}>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                  </Form.Select>
                </div>
              </div>


              {/* CONTENT */}
              <div className={styles.section}>
                <h2>Content</h2>

                <div className={styles.row}>
                  <span>Show NSFW</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('content.showNsfw')}
                  />
                </div>

                <div className={styles.row}>
                  <span>Hide Spoilers</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('content.hideSpoilers')}
                  />
                </div>

                <div className={`${styles.row} ${styles.genresRow}`}>
                  <span>Preferred Genres</span>

                  <div className={styles.genresList}>
                    <Form.Check
                      type="checkbox"
                      label="Action"
                      value="action"
                      {...register('content.preferredGenres')}
                    />

                    <Form.Check
                      type="checkbox"
                      label="Comedy"
                      value="comedy"
                      {...register('content.preferredGenres')}
                    />

                    <Form.Check
                      type="checkbox"
                      label="Drama"
                      value="drama"
                      {...register('content.preferredGenres')}
                    />

                    <Form.Check
                      type="checkbox"
                      label="Fantasy"
                      value="fantasy"
                      {...register('content.preferredGenres')}
                    />

                    <Form.Check
                      type="checkbox"
                      label="Romance"
                      value="romance"
                      {...register('content.preferredGenres')}
                    />

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

              {/* NOTIFICATIONS */}
              <div className={styles.section}>
                <h2>Notifications</h2>

                <div className={styles.row}>
                  <span>Email</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('notifications.email')}
                  />
                </div>

                <div className={styles.row}>
                  <span>In App</span>

                  <Form.Switch
                    className={styles.switch}
                    {...register('notifications.inApp')}
                  />
                </div>

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

          <div className={styles.actions}>
            <Button type="submit">Save</Button>
            
            <Button to="/">
              Back to home
            </Button>
            
            {saveStatus === 'success' && (
              <span className={styles.success}>
                Settings saved successfully.
              </span>
            )}
          
            {saveStatus === 'error' && (
              <span className={styles.error}>
                Failed to save settings.
              </span>
            )}
          </div>
        </Container>
      </Form>
    </div>
  );
};

export default Settings;