import styles from './Signup.module.scss'
import { Col } from 'react-bootstrap'
import Container from '../../common/container/Container';
import Button from '../../common/Button/Button';

const Signup = () => {

  return (
    <div className={styles.root}>
      <Container>
        <h1>Signup</h1>
        <Col xs="12" className="d-flex justify-content-center my-3">
          <Button to="/">Back to home</Button>
        </Col>
      </Container>
    </div>
  );
};

export default Signup;