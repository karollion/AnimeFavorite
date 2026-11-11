
/* =====================================================
   ANIME DETAILS PAGE
   ===================================================== */

/**
 * @file Anime.js
 * @description Displays detailed information about a single anime,
 *              including its characters, seasons, reviews, and community
 *              statistics. Authenticated users can manage their personal
 *              anime list and rating. Administrators can access
 *              anime and character management actions.
 */

/* =====================================================
   REACT AND ROUTER
   ===================================================== */

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

/* =====================================================
   REDUX
   ===================================================== */

import { useDispatch, useSelector } from 'react-redux'

import {
  fetchAnimeBySlug,
  getSelectedAnime,
  getAnimesLoading,
  getAnimesError,
  fetchAnimeStats,
  getAnimeStats,
  getAnimeStatsLoading,
  getAnimeStatsError,
  fetchUserAnimeRelation,
  saveUserAnimeRelation,
  clearUserAnimeRelation,
  getUserAnimeRelation,
  getUserAnimeAnimeId,
  getUserAnimeLoading,
  getUserAnimeError,
} from '../../../redux/reducers/animesRedux'

import { getUser } from '../../../redux/reducers/userRedux'

/* =====================================================
   INTERNATIONALIZATION
   ===================================================== */

import { useTranslation } from 'react-i18next'

/* =====================================================
   STYLES
   ===================================================== */

import styles from './Anime.module.scss'

/* =====================================================
   CONTEXT
   ===================================================== */

import { useMessage } from '../../../context/MessageContext'

/* =====================================================
   COMPONENTS AND ASSETS
   ===================================================== */

import noImage from '../../../assets/no-image.png'

import CharacterSection from '../../features/CharacterSection/CharacterSection'
import SeasonSection from '../../features/SeasonSection/SeasonSection'
import ReviewCard from '../../features/ReviewCard/ReviewCard'

import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'

/* =====================================================
   HELPER FUNCTIONS
   ===================================================== */

/**
 * Returns a displayable value or a fallback for empty fields.
 * Arrays are converted into comma-separated strings.
 *
 * @param {*} value - Value to display.
 * @returns {string | number} Displayable value or fallback.
 */
const getDisplayValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '—'
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : '—'
  }

  return value
}

/* =====================================================
   ANIME COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders detailed information about the selected anime.
 *
 * @returns {JSX.Element} The anime details page.
 */
const Anime = () => {

  /* =====================================================
     ROUTE PARAMETERS
     ===================================================== */

  const { slug } = useParams()

  /* =====================================================
     HOOKS
     ===================================================== */

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { showMessage } = useMessage()

  /* =====================================================
     REDUX STATE
     ===================================================== */

  const anime = useSelector(getSelectedAnime)
  const loading = useSelector(getAnimesLoading)
  const error = useSelector(getAnimesError)
  const user = useSelector(getUser)

  /* =====================================================
     COMMUNITY STATISTICS
     ===================================================== */

  const stats = useSelector(getAnimeStats)
  const statsLoading = useSelector(getAnimeStatsLoading)
  const statsError = useSelector(getAnimeStatsError)

  const statsAnimeId = useSelector(
    state => state.animes.statsAnimeId
  )

  /* =====================================================
     USER ANIME RELATION
     ===================================================== */

  const userAnimeRelation = useSelector(getUserAnimeRelation)
  const userAnimeAnimeId = useSelector(getUserAnimeAnimeId)
  const userAnimeLoading = useSelector(getUserAnimeLoading)
  const userAnimeError = useSelector(getUserAnimeError)

  /* =====================================================
     LOCAL STATE
     ===================================================== */

  /**
   * Currently hovered rating value.
   */
  const [ratingHover, setRatingHover] = useState(0)

  /**
   * Controls whether the anime description is expanded.
   */
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)

  /**
   * Ensures that the selected anime matches the URL slug.
   */
  const selectedAnime =
    anime?.slug === slug ? anime : null

  /* =====================================================
     DATA FETCHING
     ===================================================== */

  /**
   * Fetches anime details whenever the URL slug changes.
   */
  useEffect(() => {
    if (!slug) return

    dispatch(fetchAnimeBySlug(slug))
  }, [dispatch, slug])

  /**
   * Fetches community statistics for the selected anime.
   */
  useEffect(() => {
    if (!selectedAnime?._id) return

    dispatch(fetchAnimeStats(selectedAnime._id))
  }, [dispatch, selectedAnime?._id])

  /**
   * Loads the authenticated user's relation to the selected anime.
   * Clears the relation when no user is authenticated.
   */
  useEffect(() => {
    if (!selectedAnime?._id) return

    if (user) {
      dispatch(
        fetchUserAnimeRelation(selectedAnime._id)
      ).catch(() => {})
    } else {
      dispatch(clearUserAnimeRelation())
    }
  }, [dispatch, selectedAnime?._id, user])

  /**
   * Resets local interaction states when navigating to another anime.
   */
  useEffect(() => {
    setRatingHover(0)
    setDescriptionExpanded(false)
  }, [slug])

  /* =====================================================
     USER ANIME RELATION HELPERS
     ===================================================== */

  /**
   * Determines whether the currently loaded relation belongs
   * to the selected anime.
   */
  const hasCurrentRelation =
    userAnimeAnimeId === selectedAnime?._id

  /**
   * Current user's rating for the selected anime.
   */
  const currentRating = hasCurrentRelation
    ? Number(userAnimeRelation?.rating) || 0
    : 0

  /**
   * Rating displayed in the interactive rating component.
   */
  const displayedRating = ratingHover || currentRating

  /**
   * Determines whether the selected anime is marked as a favorite.
   */
  const isFavorite =
    hasCurrentRelation &&
    userAnimeRelation?.favorite_anime === true

  /* =====================================================
     COMMUNITY RATING HELPERS
     ===================================================== */

  /**
   * Determines whether the statistics belong to the selected anime.
   */
  const hasCurrentStats =
    statsAnimeId === selectedAnime?._id && stats

  /**
   * Community average rating.
   */
  const communityRating = hasCurrentStats
    ? Number.isFinite(stats.ratingAvg)
      ? stats.ratingAvg.toFixed(1)
      : '—'
    : selectedAnime?.rating_avg ?? '—'

  /**
   * Number of community ratings.
   */
  const communityRatingCount = hasCurrentStats
    ? stats.ratingCount
    : selectedAnime?.rating_count ?? 0

  /* =====================================================
     USER INTERACTION HANDLERS
     ===================================================== */

  /**
   * Saves a watch status for the authenticated user.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event
   */
  const handleStatusChange = async (event) => {
    const status = event.target.value

    if (!user || !selectedAnime?._id || !status) return

    try {
      await dispatch(
        saveUserAnimeRelation(selectedAnime._id, {
          status,
        })
      )

      await showMessage({
        title: t('common.success'),
        message: t('anime.statusSaved'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (err) {
      await showMessage({
        title: t('common.error'),
        message:
          err.response?.data?.message ||
          t('anime.statusSaveError'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    }
  }

  /**
   * Toggles the authenticated user's favorite flag.
   */
  const handleFavoriteToggle = async () => {
    if (!user || !selectedAnime?._id) return

    try {
      await dispatch(
        saveUserAnimeRelation(selectedAnime._id, {
          favorite_anime: !isFavorite,
        })
      )

      await showMessage({
        title: t('common.success'),
        message: isFavorite
          ? t('anime.favoriteRemoved')
          : t('anime.favoriteAdded'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (err) {
      await showMessage({
        title: t('common.error'),
        message:
          err.response?.data?.message ||
          t('anime.favoriteError'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    }
  }

  /**
   * Saves a rating for the currently selected anime.
   *
   * @param {number} rating - Integer rating between 1 and 10.
   */
  const handleRatingChange = async (rating) => {
    if (
      !user ||
      !selectedAnime?._id ||
      userAnimeLoading
    ) {
      return
    }

    try {
      await dispatch(
        saveUserAnimeRelation(selectedAnime._id, {
          rating,
        })
      )

      await showMessage({
        title: t('common.success'),
        message: t('anime.ratingSaved', { rating }),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (err) {
      await showMessage({
        title: t('common.error'),
        message:
          err.response?.data?.message ||
          t('anime.ratingSaveError'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    }
  }

  /**
   * Removes the user's rating without changing watch status
   * or favorite settings.
   */
  const handleRatingClear = async () => {
    if (
      !user ||
      !selectedAnime?._id ||
      userAnimeLoading
    ) {
      return
    }

    try {
      await dispatch(
        saveUserAnimeRelation(selectedAnime._id, {
          rating: null,
        })
      )

      setRatingHover(0)

      await showMessage({
        title: t('common.success'),
        message: t('anime.ratingRemoved'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (err) {
      await showMessage({
        title: t('common.error'),
        message:
          err.response?.data?.message ||
          t('anime.ratingRemoveError'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    }
  }

  /* =====================================================
     IMAGE HANDLING
     ===================================================== */

  /**
   * Replaces an unavailable anime cover with the fallback image.
   *
   * @param {React.SyntheticEvent<HTMLImageElement>} event
   */
  const handleImageError = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = noImage
  }

  /* =====================================================
     DESCRIPTION HANDLING
     ===================================================== */

  const description =
    selectedAnime?.description_short || ''

  const shouldShowDescriptionToggle =
    description.length > 180

  /* =====================================================
     LOADING AND ERROR HANDLING
     ===================================================== */

  if (loading) {
    return (
      <Container>
        <p>{t('common.loading')}</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <p role="alert">
          {t('anime.loadError')}
        </p>

        <Button to="/">
          {t('common.home')}
        </Button>
      </Container>
    )
  }

  if (!selectedAnime) {
    return (
      <Container>
        <p>{t('anime.notFound')}</p>

        <Button to="/">
          {t('common.home')}
        </Button>
      </Container>
    )
  }

  /* =====================================================
     ANIME DETAILS
     ===================================================== */

  return (
    <div className={styles.root}>
      <Container>

        {/* =====================================================
            MAIN ANIME INFORMATION
            ===================================================== */}

        <section className={styles.animeDetails}>

          {/* LEFT COLUMN: COVER AND USER CONTROLS */}
          <div className={styles.leftColumn}>

            {/* Anime cover */}
            <div className={styles.coverWrapper}>
              <img
                src={selectedAnime.anime_cover || noImage}
                alt={selectedAnime.title}
                className={styles.cover}
                onError={handleImageError}
              />

              {/* Age rating and anime type */}
              <div className={styles.coverMetadata}>
                <span>
                  {selectedAnime.age_rating != null
                    ? `${selectedAnime.age_rating}+`
                    : '—'}
                </span>

                <span>
                  {getDisplayValue(selectedAnime.type)}
                </span>
              </div>
            </div>

            {/* User controls */}
            <div className={styles.userControls}>

              {user ? (
                <>
                  {/* Watch status */}
                  <div className={styles.statusControl}>
                    <select
                      id="anime-status"
                      className={styles.statusSelect}
                      value={
                        hasCurrentRelation
                          ? userAnimeRelation?.status || ''
                          : ''
                      }
                      onChange={handleStatusChange}
                      disabled={userAnimeLoading}
                    >
                      <option value="" disabled>
                        {t('anime.selectWatchStatus')}
                      </option>

                      <option value="not watched">
                        {t('anime.status.notWatched')}
                      </option>

                      <option value="planned">
                        {t('anime.status.planned')}
                      </option>

                      <option value="watching">
                        {t('anime.status.watching')}
                      </option>

                      <option value="completed">
                        {t('anime.status.completed')}
                      </option>

                      <option value="suspended">
                        {t('anime.status.suspended')}
                      </option>

                      <option value="abandoned">
                        {t('anime.status.abandoned')}
                      </option>
                    </select>
                  </div>

                  {/* Favorite toggle */}
                  <button
                    type="button"
                    className={`${styles.favoriteButton} ${
                      isFavorite ? styles.favoriteActive : ''
                    }`}
                    onClick={handleFavoriteToggle}
                    disabled={userAnimeLoading}
                    aria-pressed={isFavorite}
                    aria-label={
                      isFavorite
                        ? t('anime.removeFromFavorites')
                        : t('anime.addToFavorites')
                    }
                    title={
                      isFavorite
                        ? t('anime.removeFromFavorites')
                        : t('anime.addToFavorites')
                    }
                  >
                    <span aria-hidden="true">
                      {isFavorite ? '♥' : '♡'}
                    </span>
                  </button>
                </>
              ) : (
                <p className={styles.loginMessage}>
                  {t('anime.loginToManage')}
                </p>
              )}

              {/* Relation loading and error states */}
              {userAnimeLoading && (
                <p className={styles.statusMessage}>
                  {t('anime.savingOrLoading')}
                </p>
              )}

              {userAnimeError && (
                <p className={styles.errorMessage} role="alert">
                  {userAnimeError}
                </p>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN: ANIME INFORMATION */}
          <div className={styles.mainColumn}>

            {/* Anime title */}
            <header className={styles.animeHeader}>
              <h1>{selectedAnime.title}</h1>

              <p className={styles.originalTitle}>
                {getDisplayValue(selectedAnime.original_title)}
              </p>
            </header>

            {/* Anime metadata */}
            <div className={styles.animeMetadata}>

              <div className={styles.metadataItem}>
                <h3>{t('anime.world')}</h3>
                <p>{getDisplayValue(selectedAnime.world)}</p>
              </div>

              <div className={styles.metadataItem}>
                <h3>{t('anime.genres')}</h3>
                <p>{getDisplayValue(selectedAnime.genres)}</p>
              </div>

              <div className={styles.metadataItem}>
                <h3>{t('anime.categories')}</h3>
                <p>{getDisplayValue(selectedAnime.categories)}</p>
              </div>

            </div>

            {/* Anime description */}
            <div className={styles.descriptionSection}>
              <h2>{t('anime.description')}</h2>

              <p
                className={`${styles.descriptionText} ${
                  descriptionExpanded ? styles.descriptionExpanded : ''
                }`}
              >
                {getDisplayValue(description)}
              </p>

              {shouldShowDescriptionToggle && (
                <button
                  type="button"
                  className={styles.descriptionToggle}
                  onClick={() =>
                    setDescriptionExpanded(prev => !prev)
                  }
                  aria-expanded={descriptionExpanded}
                >
                  {descriptionExpanded
                    ? t('anime.descriptionLess')
                    : t('anime.descriptionMore')}
                </button>
              )}
            </div>

            {/* Administrative actions */}
            {user?.role === 'admin' && (
              <div className={styles.adminActions}>
                <Button to={`/anime/EditAnime/${selectedAnime.slug}`}>
                  {t('anime.edit')}
                </Button>

                <Button to={`/character/add?animeId=${selectedAnime._id}`}>
                  {t('anime.addCharacter')}
                </Button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: RATINGS AND COMMUNITY STATISTICS */}
          <aside className={styles.rightColumn}>

            {/* Community rating */}
            <section className={styles.ratingSummary}>

              <div className={styles.communityRating}>
                <strong>
                  {communityRating}
                  <span>/10</span>
                </strong>

                <span className={styles.ratingCount}>
                  {t('anime.ratingVotes')}{communityRatingCount} 
                </span>
              </div>

              {statsLoading && (
                <p className={styles.statusMessage}>
                  {t('anime.loadingStatistics')}
                </p>
              )}
            </section>

            {/* Personal rating */}
            <section className={styles.personalRating}>
              <h2>{t('anime.yourRating')}</h2>

              {!user ? (
                <p>{t('anime.loginToManage')}</p>
              ) : (
                <div className={styles.ratingContainer}>
                  <div
                    className={styles.ratingStars}
                    role="group"
                    aria-label={t('anime.ratingAriaLabel')}
                    onMouseLeave={() => setRatingHover(0)}
                  >
                    {Array.from({ length: 10 }, (_, index) => {
                      const starValue = index + 1

                      return (
                        <button
                          key={starValue}
                          type="button"
                          className={
                            starValue <= displayedRating
                              ? styles.starButtonActive
                              : styles.starButton
                          }
                          onClick={() =>
                            handleRatingChange(starValue)
                          }
                          onMouseEnter={() =>
                            setRatingHover(starValue)
                          }
                          disabled={userAnimeLoading}
                          aria-label={t('anime.rateValue', {
                            rating: starValue,
                          })}
                          aria-pressed={
                            currentRating === starValue
                          }
                          title={`${starValue}/10`}
                        >
                          ★
                        </button>
                      )
                    })}
                  </div>

                  <div className={styles.personalRatingFooter}>
                    {/* Remove rating */}
                    {currentRating > 0 && (
                      <button
                        type="button"
                        className={styles.clearRatingButton}
                        onClick={handleRatingClear}
                        disabled={userAnimeLoading}
                        aria-label={t('anime.removeRating')}
                        title={t('anime.removeRating')}
                      >
                        <span aria-hidden="true">▤</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Community statistics */}
            <section className={styles.communityStatistics}>
              <h2>{t('anime.communityStatistics')}</h2>

              {statsError && (
                <p className={styles.errorMessage} role="alert">
                  {t('anime.statisticsError')}: {statsError}
                </p>
              )}

              {!statsLoading &&
                !statsError &&
                hasCurrentStats && (
                  <>
                    <div className={styles.statisticRow}>
                      <span>{t('anime.totalUsersOnList')}</span>
                      <strong>{stats.total}</strong>
                    </div>

                    <div className={styles.statisticRow}>
                      <span>{t('anime.favorites')}</span>
                      <strong>{stats.favorites}</strong>
                    </div>

                    <h3>{t('anime.watchStatus')}</h3>

                    <div className={styles.watchStatistics}>
                      <div className={styles.statisticRow}>
                        <span>{t('anime.status.notWatched')}</span>
                        <strong>{stats.notWatched}</strong>
                      </div>

                      <div className={styles.statisticRow}>
                        <span>{t('anime.status.planned')}</span>
                        <strong>{stats.planned}</strong>
                      </div>

                      <div className={styles.statisticRow}>
                        <span>{t('anime.status.watching')}</span>
                        <strong>{stats.watching}</strong>
                      </div>

                      <div className={styles.statisticRow}>
                        <span>{t('anime.status.completed')}</span>
                        <strong>{stats.completed}</strong>
                      </div>

                      <div className={styles.statisticRow}>
                        <span>{t('anime.status.suspended')}</span>
                        <strong>{stats.suspended}</strong>
                      </div>

                      <div className={styles.statisticRow}>
                        <span>{t('anime.status.abandoned')}</span>
                        <strong>{stats.abandoned}</strong>
                      </div>
                    </div>
                  </>
                )}
            </section>

          </aside>
        </section>

        {/* =====================================================
            ANIME CHARACTERS
            ===================================================== */}

        <CharacterSection
          title={t('anime.characters')}
          characters={selectedAnime.characters || []}
        />

        {/* =====================================================
            ANIME SEASONS
            ===================================================== */}

        <SeasonSection
          title={t('anime.seasons')}
          seasons={selectedAnime.seasons || []}
        />

        {/* =====================================================
            ANIME REVIEWS
            ===================================================== */}

        <section className={styles.reviewsSection}>
          <h2>{t('anime.reviews')}</h2>

          {selectedAnime.reviews?.length > 0 ? (
            <div className={styles.reviewsList}>
              {selectedAnime.reviews.map(review => (
                <ReviewCard
                  review={review}
                  key={review._id}
                />
              ))}
            </div>
          ) : (
            <p>{t('anime.noReviews')}</p>
          )}
        </section>

        {/* =====================================================
            RETURN TO HOME PAGE
            ===================================================== */}

        <div className={styles.homeButton}>
          <Button to="/">
            {t('common.home')}
          </Button>
        </div>

      </Container>
    </div>
  )
}

export default Anime
