/* =====================================================
   User Animes Page
   ===================================================== */

/**
 * @file MyAnimes.js
 * @description Page component for displaying anime collections grouped by viewing status.
 *              
 */

import styles from './MyAnimes.module.scss'

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
  getUserStats
} from '../../../redux/reducers/userRedux'

/* =====================================================
   REACT HOOKS
   ===================================================== */

import { useState } from 'react'

/* =====================================================
   COMPONENTS AND ASSETS
   ===================================================== */

import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'
import StatsList from '../../features/StatsList/StatsList'

/* =====================================================
   MyAnimes COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders the anime-related statistics.
 *              Retrieves statistics from Redux.
 *              Allows switching between anime collections using animated tabs.
 *
 * @returns {JSX.Element} The user animes page.
 */
const MyAnimes = () => {
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
        <h1>User Animes</h1>

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

export default MyAnimes