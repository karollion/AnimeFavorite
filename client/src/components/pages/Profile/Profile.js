/* =====================================================
   User Profile Page
   ===================================================== */

/**
 * @file Profile.js
 * @description Page component for displaying the authenticated user's profile.
 *              Displays personal information, avatar, favorite characters
 */

import styles from './Profile.module.scss'

/* =====================================================
   ANIMATION AND UI LIBRARIES
   ===================================================== */

import { Col } from 'react-bootstrap'

/* =====================================================
   REDUX STATE MANAGEMENT
   ===================================================== */

import { useSelector } from 'react-redux'
import {
  getUser,
} from '../../../redux/reducers/userRedux'

/* =====================================================
   COMPONENTS AND ASSETS
   ===================================================== */

import noImage from '../../../assets/no-image.png'
import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'
import CharacterCard from '../../features/CharacterCard/CharacterCard'

/* =====================================================
   PROFILE COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders the user's profile.
 *              Retrieves user information from Redux.
 *
 * @returns {JSX.Element} The user profile page.
 */
const Profile = () => {

  /* =====================================================
     REDUX STATE
     ===================================================== */

  /**
   * Currently authenticated user's profile data.
   * Includes personal information and favorite characters.
   */
  const user = useSelector(getUser)

  /* =====================================================
     PROFILE INFORMATION
     ===================================================== */

  return (
    <div className={styles.root}>
      <Container>

        {/* Main page heading */}
        <h1>User Profile</h1>

        {/* User avatar and personal information */}
        <div className={styles.about}>

          {/* Displays the user avatar or a fallback image */}
          <img
            src={user.avatar || noImage}
            alt={user.login}
            className={styles.img}
          />

          <div>

            {/* Navigation to the profile editing page */}
            <Button to="/ProfileEdit">Edit</Button>

            {/* Basic user account information */}
            <p>Login: {user.login}</p>
            <p>Role: {user.role}</p>
            <p>Email: {user.email}</p>
            <p>Birth year: {user.birth_year}</p>
            <p>Description: {user.description}</p>

          </div>
        </div>

        {/* =====================================================
            FAVORITE CHARACTERS
            ===================================================== */}

        {/* Displays the characters marked as favorites by the user */}
        <p>Favorite characters:</p>

        <div className={styles.characters}>
          {user.favorite_characters?.map(c => (
            <div key={c._id}>
              <CharacterCard character={c} />
            </div>
          ))}
        </div>

        {/* =====================================================
            PAGE NAVIGATION
            ===================================================== */}

        {/* Navigation back to the home page */}
        <Col xs="12" className="d-flex justify-content-center my-3">
          <Button to="/">Back to home</Button>
        </Col>

      </Container>
    </div>
  )
}

export default Profile