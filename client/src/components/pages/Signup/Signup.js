/* =====================================================
   Signup Page
   ===================================================== */

/**
 * @file Signup.js
 * @description Renders the user registration page and
 * displays the signup form.
 */

// Styles
import styles from './Signup.module.scss'

// Layout components
import Container from '../../common/container/Container'

// Feature components
import SignupForm from '../../features/SignupForm/SignupForm'

/**
 * Signup component.
 *
 * Displays the registration page heading and the
 * SignupForm component used to create a new account.
 *
 * @component
 * @returns {JSX.Element} The signup page.
 */
const Signup = () => {

  return (
    <div className={styles.root}>
      <Container>
        {/* Page heading */}
        <h1>Signup</h1>

        {/* User registration form */}
        <SignupForm />
      </Container>
    </div>
  );
};

export default Signup;