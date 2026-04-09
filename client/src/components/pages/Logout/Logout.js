import styles from './Logout.module.scss';
import Container from '../../common/container/Container';
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
        <h1>Logout...</h1>
      </Container>
    </div>
  );
};

export default Logout;