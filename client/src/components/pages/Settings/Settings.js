import styles from './Settings.module.scss'
import { Col } from 'react-bootstrap'
import Container from '../../common/container/Container';
import Button from '../../common/Button/Button';

const Settings = () => {

  return (
    <div className={styles.root}>
      <Container>
        <h1>Settings</h1>
        <Col xs="12" className="d-flex justify-content-center my-3">
          <p>Theme: </p>
          <p>Language: </p>
          <Button to="/">Back to home</Button>
        </Col>
      </Container>
    </div>
  );
};

export default Settings;