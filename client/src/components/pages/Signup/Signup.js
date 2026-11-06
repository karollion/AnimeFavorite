/**
 * @file Signup.js
 * @description Renders the user registration page and
 * displays the signup form.
 */

// Styles
import styles from './Signup.module.scss';

// Layout components
import Container from '../../common/container/Container';

// Feature components
import SignupForm from '../../features/SignupForm/SignupForm';

// Translations
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <Container>
        <h1>{t('signup.title')}</h1>

        <SignupForm />
      </Container>
    </div>
  );
};

export default Signup;
