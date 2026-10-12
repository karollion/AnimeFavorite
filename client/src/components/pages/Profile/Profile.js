/* =====================================================
   User Profile Page
   ===================================================== */

/**
 * @file Profile.js
 * @description Page component for displaying the authenticated user's profile.
 *              Displays personal information, avatar, favorite characters,
 *              and anime collections grouped by viewing status.
 *              Provides navigation to profile editing and animated switching
 *              between statistics tabs.
 */

import styles from './Profile.module.scss'

/* =====================================================
   ANIMATION AND UI LIBRARIES
   ===================================================== */

import { motion, AnimatePresence } from 'framer-motion'
import { Col } from 'react-bootstrap'

/* =====================================================
   REDUX STATE MANAGEMENT
   ===================================================== */

import { useSelector } from 'react-redux'
import {
  getUser,
  getUserStats
} from '../../../redux/reducers/userRedux'

/* =====================================================
   REACT HOOKS
   ===================================================== */

import { useState } from 'react'

/* =====================================================
   COMPONENTS AND ASSETS
   ===================================================== */

import noImage from '../../../assets/no-image.png'
import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'
import CharacterCard from '../../features/CharacterCard/CharacterCard'
import StatsList from '../../features/StatsList/StatsList'

/* =====================================================
   PROFILE COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders the user's profile and anime-related statistics.
 *              Retrieves user information and statistics from Redux.
 *              Allows switching between anime collections using animated tabs.
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

  /**
   * User statistics, including favorite anime and anime grouped
   * by viewing status.
   */
  const stats = useSelector(getUserStats)

  /* =====================================================
     TAB STATE
     ===================================================== */

  /**
   * Currently selected profile statistics tab.
   * Defaults to the favorites collection.
   *
   * @type {[string, Function]}
   */
  const [activeTab, setActiveTab] = useState('favorites')

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
            STATISTICS NAVIGATION
            ===================================================== */}

        {/* Buttons for selecting an anime collection by viewing status */}
        <div className={styles.stats_nav}>

          {/* Favorite anime collection */}
          <Button
            action={() => setActiveTab('favorites')}
            active={activeTab !== 'favorites'}
          >
            Favorites [{stats?.favoriteAnime?.length}]
          </Button>

          {/* Anime currently being watched */}
          <Button
            action={() => setActiveTab('watching')}
            active={activeTab !== 'watching'}
          >
            Watching [{stats?.statuses?.watching?.count}]
          </Button>

          {/* Anime marked as completed */}
          <Button
            action={() => setActiveTab('completed')}
            active={activeTab !== 'completed'}
          >
            Completed [{stats?.statuses?.completed?.count}]
          </Button>

          {/* Anime planned for future viewing */}
          <Button
            action={() => setActiveTab('planned')}
            active={activeTab !== 'planned'}
          >
            Planned [{stats?.statuses?.planned?.count}]
          </Button>

          {/* Anime temporarily put on hold */}
          <Button
            action={() => setActiveTab('suspended')}
            active={activeTab !== 'suspended'}
          >
            Suspended [{stats?.statuses?.suspended?.count}]
          </Button>

          {/* Anime the user has stopped watching */}
          <Button
            action={() => setActiveTab('abandoned')}
            active={activeTab !== 'abandoned'}
          >
            Abandoned [{stats?.statuses?.abandoned?.count}]
          </Button>

        </div>

        {/* =====================================================
            ANIMATED STATISTICS CONTENT
            ===================================================== */}

        {/*
          AnimatePresence handles exit animations when the selected tab changes.
          The motion.div key forces the content to be recreated for each tab,
          allowing the enter and exit animations to run.
        */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >

            {/* Favorite anime */}
            {activeTab === 'favorites' && (
              <><StatsList stats={stats?.favoriteAnime || []} /></>
            )}

            {/* Anime currently being watched */}
            {activeTab === 'watching' && (
              <><StatsList stats={stats?.statuses?.watching?.anime || []} /></>
            )}

            {/* Completed anime */}
            {activeTab === 'completed' && (
              <><StatsList stats={stats?.statuses?.completed?.anime || []} /></>
            )}

            {/* Anime planned for future viewing */}
            {activeTab === 'planned' && (
              <><StatsList stats={stats?.statuses?.planned?.anime || []} /></>
            )}

            {/* Anime temporarily put on hold */}
            {activeTab === 'suspended' && (
              <><StatsList stats={stats?.statuses?.suspended?.anime || []} /></>
            )}

            {/* Anime the user has stopped watching */}
            {activeTab === 'abandoned' && (
              <><StatsList stats={stats?.statuses?.abandoned?.anime || []} /></>
            )}

          </motion.div>
        </AnimatePresence>

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