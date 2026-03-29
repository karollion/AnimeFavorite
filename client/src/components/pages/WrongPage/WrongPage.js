import styles from './WrongPage.module.scss'
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap'
import Container from '../../common/container/Container';
import Button from '../../common/Button/Button';

const WrongPage = () => {

  return (
    <div className={styles.root}>
      <Container>
        <h1>404</h1>
        <h4>Oh no!</h4>
    
        <Col xs="12" className="d-flex justify-content-center my-3">
          <Button to="/">Back to home</Button>
        </Col>
      </Container>
    </div>
  );
};

export default WrongPage;