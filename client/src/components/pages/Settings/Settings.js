import styles from './Settings.module.scss'
import { Row, Col, Form } from 'react-bootstrap'
import Container from '../../common/container/Container';
import Button from '../../common/Button/Button';
import { getUser } from '../../../redux/reducers/userRedux';
import { useSelector } from 'react-redux';

const Settings = () => {
  const user = useSelector(getUser);

  return (
    <div className={styles.root}>
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
        
                <Form.Select>
                  <option>Dark</option>
                  <option>Light</option>
                  <option>System</option>
                </Form.Select>
              </div>
        
              <div className={styles.row}>
                <span>Language</span>
        
                <Form.Select>
                  <option>English</option>
                  <option>Polish</option>
                  <option>German</option>
                </Form.Select>
              </div>
        
              <div className={styles.row}>
                <span>Default View</span>
        
                <Form.Select>
                  <option>Grid</option>
                  <option>List</option>
                  <option>Compact</option>
                </Form.Select>
              </div>
        
              <div className={styles.row}>
                <span>Auto Play</span>
        
                <Form.Switch />
              </div>
        
              <div className={styles.row}>
                <span>Default Sort</span>
        
                <Form.Select>
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Most Popular</option>
                  <option>Alphabetical</option>
                </Form.Select>
              </div>
            </div>
        
        
            {/* CONTENT */}
            <div className={styles.section}>
              <h2>Content</h2>
        
              <div className={styles.row}>
                <span>Show NSFW</span>
        
                <Form.Switch />
              </div>
        
              <div className={styles.row}>
                <span>Hide Spoilers</span>
        
                <Form.Switch defaultChecked />
              </div>
        
              <div className={`${styles.row} ${styles.genresRow}`}>
                <span>Preferred Genres</span>
        
                <div className={styles.genresList}>
                  <Form.Check type="checkbox" label="Action" />
                  <Form.Check type="checkbox" label="Comedy" />
                  <Form.Check type="checkbox" label="Drama" />
                  <Form.Check type="checkbox" label="Fantasy" />
                  <Form.Check type="checkbox" label="Romance" />
                  <Form.Check type="checkbox" label="Sci-Fi" />
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
        
                <Form.Switch />
              </div>
        
              <div className={styles.row}>
                <span>In App</span>
        
                <Form.Switch defaultChecked />
              </div>
        
              <div className={styles.row}>
                <span>Push</span>
        
                <Form.Switch />
              </div>
            </div>
        
          </Col>
        
        </Row>
        
        <div className={styles.actions}>
          {user ? <Button /> : null}
        
          <Button to="/">
            Back to home
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Settings;