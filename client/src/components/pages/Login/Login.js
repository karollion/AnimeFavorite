/* =====================================================
   Login Page
   ===================================================== */

/**
 * @file Login.js
 * @description Page component for user authentication.
 *              Provides a page layout with a heading and the reusable
 *              LoginForm component for entering login credentials.
 */

import styles from './Login.module.scss'

/* =====================================================
   COMPONENTS
   ===================================================== */

import Container from '../../common/container/Container'
import LoginForm from '../../features/LoginForm/LoginForm'

/* =====================================================
   LOGIN COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders the user login page.
 *              Uses the shared LoginForm component to handle
 *              the authentication form and its associated actions.
 *
 * @returns {JSX.Element} The login page.
 */
const Login = () => {

  /* =====================================================
     PAGE LAYOUT
     ===================================================== */

  return (
    <div className={styles.root}>
      <Container>

        {/* Page heading */}
        <h1>Login</h1>

        {/* Form for entering user authentication credentials */}
        <LoginForm />

      </Container>
    </div>
  )
}

export default Login