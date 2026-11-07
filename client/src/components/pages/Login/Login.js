
/**
 * @file Login.js
 * @description Page component for user authentication.
 *              Provides a page layout with a heading and the reusable
 *              LoginForm component.
 */

// Styles
import styles from './Login.module.scss'

// Translations
import { useTranslation } from 'react-i18next'

// UI components
import Container from '../../common/container/Container'
import LoginForm from '../../features/LoginForm/LoginForm'

const Login = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.root}>
      <Container>

        {/* Main page heading */}
        <h1>
          {t('login.title')}
        </h1>

        {/* User authentication form */}
        <LoginForm />

      </Container>
    </div>
  )
}

export default Login
