/**
 * @file Anime.js
 * @description Displays detailed information about a single anime,
 * including its characters, seasons, reviews, and community statistics.
 * Authenticated users can manage their personal anime list and rating.
 * Administrators can access anime and character management actions.
 */

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import styles from './Anime.module.scss'

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

import { useMessage } from '../../../context/MessageContext'

import noImage from '../../../assets/no-image.png'

import CharacterCard from '../../features/CharacterCard/CharacterCard'
import SeasonCard from '../../features/SeasonCard/SeasonCard'
import ReviewCard from '../../features/ReviewCard/ReviewCard'

import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'

/**
 * @component
 * @description Renders detailed information about the selected anime.
 *
 * @returns {JSX.Element} The anime details page.
 */
const Anime = () => {
  const { slug } = useParams()

  const dispatch = useDispatch()

  const { t } = useTranslation()
  const { showMessage } = useMessage()

  // Redux state: anime details.
  const anime = useSelector(getSelectedAnime)
  const loading = useSelector(getAnimesLoading)
  const error = useSelector(getAnimesError)

  // Redux state: authenticated user.
  const user = useSelector(getUser)

  // Redux state: community statistics.
  const stats = useSelector(getAnimeStats)
  const statsLoading = useSelector(getAnimeStatsLoading)
  const statsError = useSelector(getAnimeStatsError)
  const statsAnimeId = useSelector(state => state.animes.statsAnimeId)

  // Redux state: authenticated user's anime relation.
  const userAnimeRelation = useSelector(getUserAnimeRelation)
  const userAnimeAnimeId = useSelector(getUserAnimeAnimeId)
  const userAnimeLoading = useSelector(getUserAnimeLoading)
  const userAnimeError = useSelector(getUserAnimeError)

  // Local state: rating interaction.
  const [ratingHover, setRatingHover] = useState(0)

  // Prevents displaying the same fetch error repeatedly.
  const displayedErrorRef = useRef(null)

  /**
   * Fetches anime details whenever the URL slug changes.
   */
  useEffect(() => {
    if (!slug) return

    dispatch(fetchAnimeBySlug(slug))
  }, [dispatch, slug])

  /**
   * Fetches community statistics for the currently selected anime.
   */
  useEffect(() => {
    if (!anime?._id || anime.slug !== slug) return

    dispatch(fetchAnimeStats(anime._id))
  }, [dispatch, anime?._id, anime?.slug, slug])

  /**
   * Loads the authenticated user's relation to the selected anime.
   * Clears the relation when no user is authenticated.
   */
  useEffect(() => {
    if (!anime?._id || anime.slug !== slug) return

    if (user) {
      dispatch(fetchUserAnimeRelation(anime._id)).catch(() => {})
    } else {
      dispatch(clearUserAnimeRelation())
    }
  }, [dispatch, anime?._id, anime?.slug, slug, user])

  /**
   * Displays a notification when loading anime data fails.
   * The reference prevents the same error from opening repeatedly.
   */
  useEffect(() => {
    if (!error) {
      displayedErrorRef.current = null
      return
    }

    if (displayedErrorRef.current === error) return

    displayedErrorRef.current = error

    showMessage({
      title: t('common.error'),
      message: t('anime.loadError'),
      mode: 'alert',
      confirmText: t('common.ok'),
    })
  }, [error, showMessage, t])

  /**
   * Saves a watch status for the authenticated user.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event
   */
  const handleStatusChange = async event => {
    const status = event.target.value

    if (!user || !anime?._id || !status) return

    try {
      await dispatch(
        saveUserAnimeRelation(anime._id, { status })
      )

      await showMessage({
        title: t('common.success'),
        message: t('anime.statusSaved'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (error) {
      await showMessage({
        title: t('common.error'),
        message: error.response?.data?.message || t('anime.statusSaveError'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    }
  }

  /**
   * Toggles the authenticated user's favorite flag.
   */
  const handleFavoriteToggle = async () => {
    if (!user || !anime?._id) return

    const isFavorite =
      userAnimeAnimeId === anime._id &&
      userAnimeRelation?.favorite_anime === true

    try {
      await dispatch(
        saveUserAnimeRelation(anime._id, {
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
    } catch (error) {
      await showMessage({
        title: t('common.error'),
        message: error.response?.data?.message || t('anime.favoriteError'),
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
    if (!user || !anime?._id || userAnimeLoading) return

    try {
      await dispatch(
        saveUserAnimeRelation(anime._id, { rating })
      )

      await showMessage({
        title: t('common.success'),
        message: t('anime.ratingSaved', { rating }),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (error) {
      await showMessage({
        title: t('common.error'),
        message: error.response?.data?.message || t('anime.ratingSaveError'),
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
    if (!user || !anime?._id || userAnimeLoading) return

    try {
      await dispatch(
        saveUserAnimeRelation(anime._id, { rating: null })
      )

      setRatingHover(0)

      await showMessage({
        title: t('common.success'),
        message: t('anime.ratingRemoved'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (error) {
      await showMessage({
        title: t('common.error'),
        message: error.response?.data?.message || t('anime.ratingRemoveError'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    }
  }

  // Display a loading state while anime details are being fetched.
  if (loading || !anime || anime.slug !== slug) {
    return (
      <Container>
        <p>{t('common.loading')}</p>
      </Container>
    )
  }

  // Display an error state if anime details could not be loaded.
  if (error) {
    return (
      <Container>
        <p role="alert">{t('anime.loadError')}</p>

        <Button to="/">
          {t('common.home')}
        </Button>
      </Container>
    )
  }

  // Determine whether the current anime has a relation loaded for the user.
  const hasCurrentRelation = userAnimeAnimeId === anime._id

  const currentRating = hasCurrentRelation
    ? Number(userAnimeRelation?.rating) || 0
    : 0

  const displayedRating = ratingHover || currentRating

  const isFavorite =
    hasCurrentRelation &&
    userAnimeRelation?.favorite_anime === true

  return (
    <div className={styles.root}>
      <Container>

        {/* Main anime information */}
        <section className={styles.animeDetails}>
          <h1>{anime.title}</h1>

          {/* Anime cover */}
          <img
            src={anime.anime_cover || noImage}
            alt={anime.title}
            className={styles.img}
          />

          {/* Basic anime metadata */}
          <p>
            {t('anime.titleLabel')} {anime.title}
          </p>

          <p>
            {t('anime.originalTitle')} {anime.original_title}
          </p>

          <p>
            {t('anime.ageRating')} {anime.age_rating}
          </p>

          <p>
            {t('anime.type')} {anime.type}
          </p>

          <p>
            {t('anime.world')} {anime.world}
          </p>

          <p>
            {t('anime.genres')} {anime.genres}
          </p>

          <p>
            {t('anime.categories')} {anime.categories}
          </p>

          <p>
            {t('anime.description')} {anime.description_short}
          </p>
        </section>

        {/* Community rating */}
        <section className={styles.statistics}>
          <h2>{t('anime.communityRating')}</h2>

          <p>
            {t('anime.ratingAverage')}{' '}
            <strong>
              {statsAnimeId === anime._id && stats
                ? Number.isFinite(stats.ratingAvg)
                  ? stats.ratingAvg.toFixed(1)
                  : '—'
                : anime.rating_avg ?? '—'}
            </strong>
          </p>

          <p>
            {t('anime.ratingCount')}{' '}
            <strong>
              {statsAnimeId === anime._id && stats
                ? stats.ratingCount
                : anime.rating_count ?? 0}
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
                        onClick={() => handleRatingChange(starValue)}
                        onMouseEnter={() => setRatingHover(starValue)}
                        disabled={userAnimeLoading}
                        aria-label={t('anime.rateValue', {
                          rating: starValue,
                        })}
                        aria-pressed={currentRating === starValue}
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
            statsAnimeId === anime._id && (
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
                    {t('anime.status.notWatched')}: {stats.notWatched}
                  </li>

                  <li>
                    {t('anime.status.planned')}: {stats.planned}
                  </li>

                  <li>
                    {t('anime.status.watching')}: {stats.watching}
                  </li>

                  <li>
                    {t('anime.status.completed')}: {stats.completed}
                  </li>

                  <li>
                    {t('anime.status.suspended')}: {stats.suspended}
                  </li>

                  <li>
                    {t('anime.status.abandoned')}: {stats.abandoned}
                  </li>
                </ul>
              </>
            )}
        </section>

        {/* Administrative actions */}
        {user?.role === 'admin' && (
          <div className={styles.adminActions}>
            <Button to={`/anime/EditAnime/${anime.slug}`}>
              {t('anime.edit')}
            </Button>

            <Button to={`/character/add?animeId=${anime._id}`}>
              {t('anime.addCharacter')}
            </Button>
          </div>
        )}

        {/* Anime characters */}
        <section className={styles.charactersSection}>
          <h2>{t('anime.characters')}</h2>

          <div className={styles.characters}>
            {anime.characters?.length > 0 ? (
              anime.characters.map(character => (
                <div key={character._id}>
                  <CharacterCard character={character} />
                </div>
              ))
            ) : (
              <p>{t('anime.noCharacters')}</p>
            )}
          </div>
        </section>

        {/* Anime seasons */}
        <section className={styles.seasonsSection}>
          <h2>{t('anime.seasons')}</h2>

          {anime.seasons?.length > 0 ? (
            anime.seasons.map(season => (
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

          {anime.reviews?.length > 0 ? (
            <ul>
              {anime.reviews.map(review => (
                <li key={review._id}>
                  <ReviewCard review={review} />
                </li>
              ))}
            </ul>
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