import styles from './Login.module.scss';
import Container from '../../common/container/Container';
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