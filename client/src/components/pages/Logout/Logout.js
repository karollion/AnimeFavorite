import styles from './Logout.module.scss';
import { Col } from 'react-bootstrap';
import Container from '../../common/container/Container';
import Button from '../../common/Button/Button';
import { logoutRequest } from '../../../redux/reducers/userRedux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutRequest());
  }, [dispatch]);

  return (
    <div className={styles.root}>
      <Container>
        <h1>Logout</h1>
        <Col xs="12" className="d-flex justify-content-center my-3">
          <Button to="/">Back to home</Button>
        </Col>
      </Container>
    </div>
  );
};

export default Logout;