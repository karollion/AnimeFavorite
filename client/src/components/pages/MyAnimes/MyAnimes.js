
/**
 * @file MyAnimes.js
 * @description Page component for displaying the user's anime collections.
 *              Groups anime by viewing status and allows switching between
 *              collections, display modes, and sorting options.
 */

// Styles
import styles from './MyAnimes.module.scss'

// React
import { useState } from 'react'

// Animation
import { AnimatePresence, motion } from 'framer-motion'

// UI components
import { Col } from 'react-bootstrap'
import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'
import StatsList from '../../features/StatsList/StatsList'

// Redux
import { useSelector } from 'react-redux'
import {
  getUser,
  getUserStats,
} from '../../../redux/reducers/userRedux'

// Translations
import { useTranslation } from 'react-i18next'

const MyAnimes = () => {
  const { t } = useTranslation()

  // Redux state.
  const user = useSelector(getUser)
  const stats = useSelector(getUserStats)

  // Active collection tab.
  const [activeTab, setActiveTab] = useState('favorites')

  // Local overrides for profile display preferences.
  // Null means that the saved profile preference is used.
  const [viewOverride, setViewOverride] = useState(null)
  const [sortOverride, setSortOverride] = useState(null)

  // Default display preferences from the user's profile.
  const savedView = user?.preferences?.ui?.defaultView
  const defaultView = savedView === 'list' ? 'list' : 'grid'

  const savedSort = user?.preferences?.behavior?.defaultSort
  const defaultSort = ['rating', 'newest', 'title'].includes(savedSort)
    ? savedSort
    : 'newest'

  // Effective display settings.
  const view = viewOverride ?? defaultView
  const sort = sortOverride ?? defaultSort

  /**
   * Defines available anime collections.
   * Each collection contains its identifier, translation key,
   * and corresponding Redux statistics data.
   */
  const tabs = [
    {
      id: 'favorites',
      label: t('myAnimes.tabs.favorites'),
      count: stats?.favoriteAnime?.length ?? 0,
      anime: stats?.favoriteAnime || [],
    },
    {
      id: 'watching',
      label: t('myAnimes.tabs.watching'),
      count: stats?.statuses?.watching?.count ?? 0,
      anime: stats?.statuses?.watching?.anime || [],
    },
    {
      id: 'completed',
      label: t('myAnimes.tabs.completed'),
      count: stats?.statuses?.completed?.count ?? 0,
      anime: stats?.statuses?.completed?.anime || [],
    },
    {
      id: 'planned',
      label: t('myAnimes.tabs.planned'),
      count: stats?.statuses?.planned?.count ?? 0,
      anime: stats?.statuses?.planned?.anime || [],
    },
    {
      id: 'suspended',
      label: t('myAnimes.tabs.suspended'),
      count: stats?.statuses?.suspended?.count ?? 0,
      anime: stats?.statuses?.suspended?.anime || [],
    },
    {
      id: 'abandoned',
      label: t('myAnimes.tabs.abandoned'),
      count: stats?.statuses?.abandoned?.count ?? 0,
      anime: stats?.statuses?.abandoned?.anime || [],
    },
  ]

  // Find the currently selected collection.
  const activeCollection = tabs.find(tab => tab.id === activeTab)

  // Authentication guard.
  if (!user) {
    return (
      <div className={styles.root}>
        <Container>
          <h1>{t('myAnimes.title')}</h1>
          <p>{t('myAnimes.loginRequired')}</p>
        </Container>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <Container>

        {/* Main page heading */}
        <h1 className={styles.title}>
          {t('myAnimes.title')}
        </h1>

        {/* Anime collection navigation */}
        <div className={styles.stats_nav}>

          {tabs.map(tab => (
            <Button
              key={tab.id}
              action={() => setActiveTab(tab.id)}
              active={activeTab !== tab.id}
            >
              {tab.label} [{tab.count}]
            </Button>
          ))}

        </div>

        {/* Display and sorting controls */}
        <div className={styles.displayControls}>

          <label>
            {t('myAnimes.view')}

            <select
              value={view}
              onChange={event => setViewOverride(event.target.value)}
            >
              <option value="grid">
                {t('settings.grid')}
              </option>

              <option value="list">
                {t('settings.list')}
              </option>
            </select>
          </label>

          <label>
            {t('myAnimes.sortBy')}

            <select
              value={sort}
              onChange={event => setSortOverride(event.target.value)}
            >
              <option value="rating">
                {t('settings.defrating')}
              </option>

              <option value="newest">
                {t('settings.defnewest')}
              </option>

              <option value="title">
                {t('settings.deftitle')} (A–Z)
              </option>
            </select>
          </label>

        </div>

        {/* Animated collection content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >

            <StatsList
              stats={activeCollection?.anime || []}
              view={view}
              sort={sort}
              loading={stats == null}
            />

          </motion.div>
        </AnimatePresence>

        {/* Navigation back to the home page */}
        <Col xs="12" className="d-flex justify-content-center my-3">
          <Button to="/">
            {t('common.home')}
          </Button>
        </Col>

      </Container>
    </div>
  )
}

export default MyAnimes
