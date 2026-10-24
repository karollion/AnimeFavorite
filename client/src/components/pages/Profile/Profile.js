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
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

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
        <h1>{t('profile.title')}</h1>

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
            <Button to="/ProfileEdit">{t('common.edit')}</Button>

            {/* Basic user account information */}
            <p>{t('profile.login')}{user.login}</p>
            <p>{t('profile.role')}{user.role}</p>
            <p>{t('profile.email')}{user.email}</p>
            <p>{t('profile.birthYear')}{user.birth_year}</p>
            <p>{t('profile.description')}{user.description}</p>

          </div>
        </div>

        {/* =====================================================
            FAVORITE CHARACTERS
            ===================================================== */}

        {/* Displays the characters marked as favorites by the user */}
        <p>{t('profile.favoriteCharacters')}</p>

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
          <Button to="/">{t('common.home')}</Button>
        </Col>

      </Container>
    </div>
  )
}

export default Profile