import styles from './Login.module.scss'
import { Col } from 'react-bootstrap'
import Container from '../../common/container/Container';
import Button from '../../common/Button/Button';
import LoginForm from '../../features/LoginForm/LoginForm';

const Login = () => {

  return (
    <div className={styles.root}>
      <Container>
        <h1>Login</h1>
        <LoginForm/>
      </Container>
    </div>
  );
};

export default Login;