
/**
 * @file Logout.js
 * @description Page component responsible for logging out the authenticated user.
 *              Dispatches the logout action when the component mounts and
 *              displays the current logout status.
 */

// Styles
import styles from './Logout.module.scss'

// React
import { useEffect, useRef, useState } from 'react'

// Redux
import { useDispatch } from 'react-redux'
import { logoutRequest } from '../../../redux/reducers/userRedux'

// Routing
import { useNavigate } from 'react-router-dom'

// Translations and messages
import { useTranslation } from 'react-i18next'
import { useMessage } from '../../../context/MessageContext'

// UI components
import Container from '../../common/container/Container'

const Logout = () => {
  const { t } = useTranslation()
  const { showMessage } = useMessage()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Prevents the logout request from being triggered more than once.
  const logoutStarted = useRef(false)

  // Controls the message displayed on the page.
  const [logoutFailed, setLogoutFailed] = useState(false)

  /**
   * Executes the logout action once when the component mounts.
   */
  useEffect(() => {
    if (logoutStarted.current) return

    logoutStarted.current = true

    const handleLogout = async () => {
      try {
        await dispatch(logoutRequest())
        navigate('/', { replace: true })
      } catch (error) {
        setLogoutFailed(true)

        await showMessage({
          title: t('common.error'),
          message: t('logout.failed'),
          mode: 'alert',
          confirmText: t('common.ok'),
        })

        navigate('/', { replace: true })
      }
    }

    handleLogout()
  }, [dispatch, navigate, showMessage, t])

  return (
    <div className={styles.root}>
      <Container>

        {/* Logout status message */}
        <h1>
          {logoutFailed
            ? t('logout.errorTitle')
            : t('logout.loading')}
        </h1>

      </Container>
    </div>
  )
}

export default Logout
