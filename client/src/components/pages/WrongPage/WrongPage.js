import styles from './WrongPage.module.scss'
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap'

const WrongPage = () => {

  return (
    <div className={styles.root}>
      <h1>404</h1>
      <h4>Oh no!</h4>

      <Col xs="12" className="d-flex justify-content-center my-3">
        <Link to="/" className={styles.btn}>
          Back to home
        </Link>
      </Col>
    </div>
  );
};

export default WrongPage;