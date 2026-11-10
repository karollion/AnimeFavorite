/**
 * @file Anime.js
 * @description Displays detailed information about a single anime,
 *              including its characters, seasons, reviews, and community
 *              statistics. Authenticated users can manage their personal
 *              anime list and rating. Administrators can access
 *              anime and character management actions.
 */

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import styles from './Anime.module.scss'

/* =====================================================
   REDUX STATE MANAGEMENT
   ===================================================== */

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
   CONTEXT
   ===================================================== */

import { useMessage } from '../../../context/MessageContext'

/* =====================================================
   COMPONENTS AND ASSETS
   ===================================================== */

import noImage from '../../../assets/no-image.png'
import CharacterSection from '../../features/CharacterSection/CharacterSection'
import SeasonCard from '../../features/SeasonCard/SeasonCard'
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
const getDisplayValue = value => {
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

  /**
   * Slug identifying the anime in the current URL.
   */
  const { slug } = useParams()

  /* =====================================================
     HOOKS AND REDUX STATE
     ===================================================== */

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { showMessage } = useMessage()

  /**
   * Anime entity currently selected in the Redux store.
   */
  const anime = useSelector(getSelectedAnime)

  /**
   * Indicates whether anime details are currently being loaded.
   */
  const loading = useSelector(getAnimesLoading)

  /**
   * Error returned by the anime fetching process, if any.
   */
  const error = useSelector(getAnimesError)

  /**
   * Currently authenticated user's data.
   */
  const user = useSelector(getUser)

  /* =====================================================
     COMMUNITY STATISTICS
     ===================================================== */

  const stats = useSelector(getAnimeStats)
  const statsLoading = useSelector(getAnimeStatsLoading)
  const statsError = useSelector(getAnimeStatsError)

  /**
   * ID of the anime for which community statistics were fetched.
   */
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
   * Used to provide visual feedback when selecting a rating.
   */
  const [ratingHover, setRatingHover] = useState(0)

  /**
   * Ensures that the selected anime matches the URL slug.
   * Prevents displaying previously selected anime data.
   */
  const selectedAnime =
    anime?.slug === slug ? anime : null

  /* =====================================================
     DATA FETCHING
     ===================================================== */

  /**
   * Fetches anime details whenever the URL slug changes.
   * Skips the request if no slug is available.
   */
  useEffect(() => {
    if (!slug) return

    dispatch(fetchAnimeBySlug(slug))
  }, [dispatch, slug])

  /**
   * Fetches community statistics for the currently selected anime.
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
   * Resets the rating hover state when navigating to another anime.
   */
  useEffect(() => {
    setRatingHover(0)
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
     USER INTERACTION HANDLERS
     ===================================================== */

  /**
   * Saves a watch status for the authenticated user.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event
   */
  const handleStatusChange = async event => {
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
  const handleRatingChange = async rating => {
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
     LOADING AND ERROR HANDLING
     ===================================================== */

  /**
   * Displays a loading message while anime details are being fetched.
   */
  if (loading) {
    return (
      <Container>
        <p>{t('common.loading')}</p>
      </Container>
    )
  }

  /**
   * Displays an error message if anime details could not be loaded.
   */
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

  /**
   * Displays a not-found message when the requested anime
   * is not available in the Redux store.
   */
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

        {/* Main anime information */}
        <section className={styles.animeDetails}>
          <h1>{selectedAnime.title}</h1>

          {/* Anime cover */}
          <img
            src={selectedAnime.anime_cover || noImage}
            alt={selectedAnime.title}
            className={styles.img}
          />

          {/* Basic anime metadata */}
          <p>
            {t('anime.titleLabel')}{' '}
            {getDisplayValue(selectedAnime.title)}
          </p>

          <p>
            {t('anime.originalTitle')}{' '}
            {getDisplayValue(selectedAnime.original_title)}
          </p>

          <p>
            {t('anime.ageRating')}{' '}
            {getDisplayValue(selectedAnime.age_rating)}
          </p>

          <p>
            {t('anime.type')}{' '}
            {getDisplayValue(selectedAnime.type)}
          </p>

          <p>
            {t('anime.world')}{' '}
            {getDisplayValue(selectedAnime.world)}
          </p>

          <p>
            {t('anime.genres')}{' '}
            {getDisplayValue(selectedAnime.genres)}
          </p>

          <p>
            {t('anime.categories')}{' '}
            {getDisplayValue(selectedAnime.categories)}
          </p>

          <p>
            {t('anime.description')}{' '}
            {getDisplayValue(selectedAnime.description_short)}
          </p>
        </section>

        {/* Community rating */}
        <section className={styles.statistics}>
          <h2>{t('anime.communityRating')}</h2>

          <p>
            {t('anime.ratingAverage')}{' '}
            <strong>
              {statsAnimeId === selectedAnime._id && stats
                ? Number.isFinite(stats.ratingAvg)
                  ? stats.ratingAvg.toFixed(1)
                  : '—'
                : selectedAnime.rating_avg ?? '—'}
            </strong>
          </p>

          <p>
            {t('anime.ratingCount')}{' '}
            <strong>
              {statsAnimeId === selectedAnime._id && stats
                ? stats.ratingCount
                : selectedAnime.rating_count ?? 0}
            </strong>
          </p>
        </section>

        {/* Personal anime list */}
        <section className={styles.userAnime}>
          <h2>{t('anime.myAnimeList')}</h2>

          {!user ? (
            <p>{t('anime.loginToManage')}</p>
          ) : (
            <>
              {/* Personal rating */}
              <div className={styles.ratingSection}>
                <h3>{t('anime.yourRating')}</h3>

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

                  <span className={styles.ratingValue}>
                    {currentRating > 0
                      ? `${currentRating}/10`
                      : t('anime.notRated')}
                  </span>
                </div>

                {/* Remove the current rating */}
                {currentRating > 0 && (
                  <button
                    type="button"
                    className={styles.clearRatingButton}
                    onClick={handleRatingClear}
                    disabled={userAnimeLoading}
                  >
                    {t('anime.removeRating')}
                  </button>
                )}
              </div>

              {/* Watch status */}
              <label htmlFor="anime-status">
                {t('anime.watchStatus')}
              </label>

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

              {/* Favorite toggle */}
              <button
                type="button"
                className={styles.favoriteButton}
                onClick={handleFavoriteToggle}
                disabled={userAnimeLoading}
                aria-pressed={isFavorite}
              >
                {isFavorite
                  ? t('anime.removeFromFavorites')
                  : t('anime.addToFavorites')}
              </button>

              {/* Relation loading and error states */}
              {userAnimeLoading && (
                <p>{t('anime.savingOrLoading')}</p>
              )}

              {userAnimeError && (
                <p role="alert">
                  {userAnimeError}
                </p>
              )}
            </>
          )}
        </section>

        {/* Community statistics */}
        <section className={styles.statistics}>
          <h2>{t('anime.communityStatistics')}</h2>

          {statsLoading && (
            <p>{t('anime.loadingStatistics')}</p>
          )}

          {statsError && (
            <p role="alert">
              {t('anime.statisticsError')}: {statsError}
            </p>
          )}

          {!statsLoading &&
            !statsError &&
            stats &&
            statsAnimeId === selectedAnime._id && (
              <>
                <p>
                  {t('anime.totalUsersOnList')}:{' '}
                  <strong>{stats.total}</strong>
                </p>

                <p>
                  {t('anime.favorites')}:{' '}
                  <strong>{stats.favorites}</strong>
                </p>

                <h3>{t('anime.watchStatus')}</h3>

                <ul>
                  <li>
                    {t('anime.status.notWatched')}:{' '}
                    {stats.notWatched}
                  </li>

                  <li>
                    {t('anime.status.planned')}:{' '}
                    {stats.planned}
                  </li>

                  <li>
                    {t('anime.status.watching')}:{' '}
                    {stats.watching}
                  </li>

                  <li>
                    {t('anime.status.completed')}:{' '}
                    {stats.completed}
                  </li>

                  <li>
                    {t('anime.status.suspended')}:{' '}
                    {stats.suspended}
                  </li>

                  <li>
                    {t('anime.status.abandoned')}:{' '}
                    {stats.abandoned}
                  </li>
                </ul>
              </>
            )}
        </section>

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

        {/* Anime characters */}
        <CharacterSection
          title={t('anime.characters')}
          characters={selectedAnime.characters || []}
        />

        {/* Anime seasons */}
        <section className={styles.seasonsSection}>
          <h2>{t('anime.seasons')}</h2>

          {selectedAnime.seasons?.length > 0 ? (
            selectedAnime.seasons.map(season => (
              <div key={season._id}>
                <SeasonCard season={season} />
              </div>
            ))
          ) : (
            <p>{t('anime.noSeasons')}</p>
          )}
        </section>

        {/* Anime reviews */}
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

        {/* Return to the home page */}
        <Button to="/">
          {t('common.home')}
        </Button>

      </Container>
    </div>
  )
}

export default Anime
