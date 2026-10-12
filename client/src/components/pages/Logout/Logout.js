/* =====================================================
   Logout Page
   ===================================================== */

/**
 * @file Logout.js
 * @description Page component responsible for initiating the user logout process.
 *              Dispatches the logoutRequest action when the component mounts
 *              and displays a logout message while the process is handled.
 */

import styles from './Logout.module.scss'

/* =====================================================
   REDUX STATE MANAGEMENT
   ===================================================== */

import { useDispatch } from 'react-redux'
import { logoutRequest } from '../../../redux/reducers/userRedux'

/* =====================================================
   REACT HOOKS
   ===================================================== */

import { useEffect } from 'react'

/* =====================================================
   COMPONENTS
   ===================================================== */

import Container from '../../common/container/Container'

/* =====================================================
   LOGOUT COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders the logout page and initiates the logout action
 *              through Redux when the component mounts.
 *
 * @returns {JSX.Element} The logout page.
 */
const Logout = () => {

  /* =====================================================
     REDUX DISPATCH
     ===================================================== */

  /**
   * Redux dispatch function used to trigger the logout action.
   */
  const dispatch = useDispatch()

  /* =====================================================
     LOGOUT ACTION
     ===================================================== */

  /**
   * Dispatches the logoutRequest action when the component mounts.
   *
   * @dependency dispatch - Redux dispatch function.
   */
  useEffect(() => {
    dispatch(logoutRequest())
  }, [dispatch])

  /* =====================================================
     LOGOUT PAGE CONTENT
     ===================================================== */

  return (
    <div className={styles.root}>
      <Container>

        {/* Message displayed while the logout process is handled */}
        <h1>Logout...</h1>

      </Container>
    </div>
  )
}

export default Logout