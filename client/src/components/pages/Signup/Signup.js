import styles from './Signup.module.scss'
import Container from '../../common/container/Container';
import SignupForm from '../../features/SignupForm/SignupForm';

const Signup = () => {

  return (
    <div className={styles.root}>
      <Container>
        <h1>Signup</h1>
        <SignupForm/>
      </Container>
    </div>
  );
};

export default Signup;