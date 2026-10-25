/* =====================================================
   Anime Page
   ===================================================== */

/**
 * @file Anime.js
 * @description Page component for displaying detailed information about
 *              a single anime entity.
 *              Fetches anime data by slug and displays its basic information,
 *              cover image, characters, seasons, and reviews.
 *              Provides an anime editing option for administrators.
 */

import styles from './Anime.module.scss'

/* =====================================================
   ROUTING AND REACT HOOKS
   ===================================================== */

import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

/* =====================================================
   REDUX STATE MANAGEMENT
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
   COMPONENTS AND ASSETS
   ===================================================== */

import noImage from '../../../assets/no-image.png'
import CharacterCard from '../../features/CharacterCard/CharacterCard'
import SeasonCard from '../../features/SeasonCard/SeasonCard'
import ReviewCard from '../../features/ReviewCard/ReviewCard'
import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'

/* =====================================================
   ANIME COMPONENT
   ===================================================== */

/**
 * @component
 * @description Displays detailed information about the selected anime.
 *              Retrieves the anime slug from the URL and fetches the
 *              corresponding anime data through Redux.
 *
 * @returns {JSX.Element} The anime details page.
 */
const Anime = () => {

  /* =====================================================
     ROUTE PARAMETERS
     ===================================================== */

  /**
   * Slug identifying the anime in the current URL.
   * @type {string | undefined}
   */
  const { slug } = useParams()

  /* =====================================================
     REDUX STATE AND DISPATCH
     ===================================================== */

  /**
   * Redux dispatch function used to trigger anime data requests.
   */
  const dispatch = useDispatch()

  /**
   * Indicates whether anime data is currently being loaded.
   */
  const loading = useSelector(getAnimesLoading)

  /**
   * Anime entity currently selected in the Redux store.
   */
  const anime = useSelector(getSelectedAnime)

  /**
   * Error returned by the anime data fetching process, if any.
   */
  const error = useSelector(getAnimesError)

  /**
   * Currently authenticated user's data.
   * Used to determine whether administrative actions are available.
   */
  const user = useSelector(getUser)

  /**
   * Anime stats and relations
   */
  const stats = useSelector(getAnimeStats)
  const statsLoading = useSelector(getAnimeStatsLoading)
  const statsError = useSelector(getAnimeStatsError)
  const statsAnimeId = useSelector(state => state.animes.statsAnimeId)

  const userAnimeRelation = useSelector(getUserAnimeRelation)
  const userAnimeAnimeId = useSelector(getUserAnimeAnimeId)
  const userAnimeLoading = useSelector(getUserAnimeLoading)
  const userAnimeError = useSelector(getUserAnimeError)

  const [actionMessage, setActionMessage] = useState('')
  const [actionError, setActionError] = useState('')

  const [ratingHover, setRatingHover] = useState(0)

   /* =====================================================
   FETCH COMMUNITY STATISTICS
   ===================================================== */

  /**
   * Fetches community statistics whenever the selected anime changes.
   */
  useEffect(() => {
    if (!anime?._id || anime.slug !== slug) return

    dispatch(fetchAnimeStats(anime._id))
  }, [dispatch, anime?._id, anime?.slug, slug])

  useEffect(() => {
    if (!anime?._id || anime.slug !== slug) return

    if (user) {
      dispatch(fetchUserAnimeRelation(anime._id)).catch(() => {})
    } else {
      dispatch(clearUserAnimeRelation())
    }
  }, [dispatch, anime?._id, anime?.slug, slug, user])

  /* =====================================================
     DATA FETCHING
     ===================================================== */

  /**
   * Fetches anime details whenever the URL slug changes.
   * Skips the request if no slug is available.
   *
   * @dependency dispatch - Redux dispatch function.
   * @dependency slug - Identifier of the requested anime.
   */
  useEffect(() => {
    if (!slug) return
    dispatch(fetchAnimeBySlug(slug))
  }, [dispatch, slug])

  /* =====================================================
     USER ANIME ACTIONS
     ===================================================== */

  /**
   * Updates the authenticated user's watch status.
   */
  const handleStatusChange = async event => {
    const status = event.target.value

    if (!user || !anime?._id || !status) return

    setActionMessage('')
    setActionError('')

    try {
      await dispatch(saveUserAnimeRelation(anime._id, { status }))
      setActionMessage('Watch status saved successfully.')
    } catch (err) {
      setActionError(
        err.response?.data?.message || 'Could not save watch status.'
      )
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

    setActionMessage('')
    setActionError('')

    try {
      await dispatch(saveUserAnimeRelation(anime._id, {
        favorite_anime: !isFavorite,
      }))

      setActionMessage(
        isFavorite
          ? 'Removed from favorites.'
          : 'Added to favorites.'
      )
    } catch (err) {
      setActionError(
        err.response?.data?.message || 'Could not update favorites.'
      )
    }
  }

  /* =====================================================
     LOADING AND ERROR HANDLING
     ===================================================== */

  /**
   * Displays a loading message while the request is in progress
   * or while the selected anime data is not yet available.
   */
  if (loading || !anime) return <p>Loading...</p>

  /**
   * Displays an error message if the anime request has failed.
   */
  if (error) return <p>Error: {error}</p>

  /**
   * Saves the authenticated user's rating for the current anime.
   * The value must be an integer between 1 and 10.
   */
  const handleRatingChange = async rating => {
    if (!user || !anime?._id || userAnimeLoading) return

    setActionMessage('')
    setActionError('')

    try {
      await dispatch(
        saveUserAnimeRelation(anime._id, { rating })
      )

      setActionMessage(`Your rating of ${rating}/10 has been saved.`)
    } catch (err) {
      setActionError(
        err.response?.data?.message || 'Could not save your rating.'
      )
    }
  }

  /**
   * Removes the user's rating without changing watch status
   * or favorite settings.
   */
  const handleRatingClear = async () => {
    if (!user || !anime?._id || userAnimeLoading) return

    setActionMessage('')
    setActionError('')

    try {
      await dispatch(
        saveUserAnimeRelation(anime._id, { rating: null })
      )

      setActionMessage('Your rating has been removed.')
    } catch (err) {
      setActionError(
        err.response?.data?.message || 'Could not remove your rating.'
      )
    }
  }

  /* =====================================================
     ANIME DETAILS
     ===================================================== */

  return (
    <div className={styles.root}>
      <Container>

        {/* Main anime title */}
        <h1>{anime.title}</h1>

        {/* Anime cover with a fallback image when no cover is available */}
        <img
          src={anime.anime_cover || noImage}
          alt={anime.title}
          className={styles.img}
        />

        {/* Basic anime information */}
        <p>Title:  {anime.title}</p>
        <p>Original title: {anime.original_title}</p>
        <p>Age rating: {anime.age_rating}</p>
        <p>Type: {anime.type}</p>
        <p>World: {anime.world}</p>
        <p>Genres: {anime.genres}</p>
        <p>Categories: {anime.categories}</p>
        {/* =====================================================
            COMMUNITY RATING
            ===================================================== */}
        
        <p>
          Rating avg:{' '}
          <strong>
            {statsAnimeId === anime._id && stats
              ? Number.isFinite(stats.ratingAvg)
                ? stats.ratingAvg.toFixed(1)
                : '—'
              : anime.rating_avg ?? '—'}
          </strong>
        </p>
            
        <p>
          Rating count:{' '}
          <strong>
            {statsAnimeId === anime._id && stats
              ? stats.ratingCount
              : anime.rating_count ?? 0}
          </strong>
        </p>

        {/* =====================================================
            USER ANIME LIST
            ===================================================== */}
        
        <section className={styles.userAnime}>
          <h2>My anime list</h2>
                
          {!user ? (
            <p>Log in to manage your anime list and favorites.</p>
          ) : (
            <>
            {/* =====================================================
                PERSONAL ANIME RATING
                ===================================================== */}

            <div className={styles.ratingSection}>
              <h3>Your rating</h3>

              {/*
                The rating belongs to the currently displayed anime.
                Zero means that the user has not rated this anime yet.
              */}
              {(() => {
                const currentRating =
                  userAnimeAnimeId === anime._id
                    ? Number(userAnimeRelation?.rating) || 0
                    : 0
              
                const displayedRating = ratingHover || currentRating
              
                return (
                  <>
                    <div
                      className={styles.ratingStars}
                      role="group"
                      aria-label="Rate this anime from 1 to 10"
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
                            aria-label={`Rate ${starValue} out of 10`}
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
                          : 'Not rated'}
                      </span>
                    </div>
                        
                    {currentRating > 0 && (
                      <button
                        type="button"
                        className={styles.clearRatingButton}
                        onClick={handleRatingClear}
                        disabled={userAnimeLoading}
                      >
                        Remove rating
                      </button>
                    )}
                  </>
                )
              })()}
            </div>
              <label htmlFor="anime-status">
                Watch status
              </label>
          
              <select
                id="anime-status"
                className={styles.statusSelect}
                value={
                  userAnimeAnimeId === anime._id
                    ? userAnimeRelation?.status || ''
                    : ''
                }
                onChange={handleStatusChange}
                disabled={userAnimeLoading}
              >
                <option value="" disabled>
                  Select watch status
                </option>
                <option value="not watched">Not watched</option>
                <option value="planned">Planned</option>
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
                <option value="suspended">Suspended</option>
                <option value="abandoned">Abandoned</option>
              </select>
              
              <button
                type="button"
                className={styles.favoriteButton}
                onClick={handleFavoriteToggle}
                disabled={userAnimeLoading}
                aria-pressed={
                  userAnimeAnimeId === anime._id &&
                  userAnimeRelation?.favorite_anime === true
                }
              >
                {userAnimeAnimeId === anime._id &&
                userAnimeRelation?.favorite_anime === true
                  ? '♥ Remove from favorites'
                  : '♡ Add to favorites'}
              </button>
                
              {userAnimeLoading && (
                <p>Saving or loading your list...</p>
              )}
        
              {actionMessage && (
                <p role="status">{actionMessage}</p>
              )}
        
              {(actionError || userAnimeError) && (
                <p role="alert">
                  {actionError || userAnimeError}
                </p>
              )}
            </>
          )}
        </section>
        
        {/* =====================================================
            COMMUNITY STATISTICS
            ===================================================== */}

        <section className={styles.statistics}>
          <h2>Community statistics</h2>
        
          {statsLoading && <p>Loading statistics...</p>}
        
          {statsError && (
            <p>Could not load community statistics: {statsError}</p>
          )}

          {!statsLoading &&
            !statsError &&
            stats &&
            statsAnimeId === anime._id && (
              <>
                <p>
                  Total users on list: <strong>{stats.total}</strong>
                </p>
            
                <p>
                  Favorites: <strong>{stats.favorites}</strong>
                </p>
            
                <h3>Watch status</h3>
            
                <ul>
                  <li>Not watched: {stats.notWatched}</li>
                  <li>Planned: {stats.planned}</li>
                  <li>Watching: {stats.watching}</li>
                  <li>Completed: {stats.completed}</li>
                  <li>Suspended: {stats.suspended}</li>
                  <li>Abandoned: {stats.abandoned}</li>
                </ul>
              </>
            )}
        </section>

        <p>Description: {anime.description_short}</p>

        {/* Anime editing action available only to administrators */}
        {user?.role === 'admin' && (
          <div>
            <Button to={"/anime/EditAnime/" + anime.slug}>Edit</Button>
            <Button to={`/character/add?animeId=${anime._id}`}>
              Add character
            </Button>
          </div>
        )}

        {/* =====================================================
            CHARACTERS
            ===================================================== */}

        {/* Renders a card for each character associated with the anime */}
        <p>Characters:</p>
        <div className={styles.characters}>
          {anime.characters?.map(c => (
            <div key={c._id}>
              <CharacterCard character={c} />
            </div>
          ))}
        </div>

        {/* =====================================================
            SEASONS
            ===================================================== */}

        {/* Renders a card for each season associated with the anime */}
        <p>Seasons:</p>
        <div>
          {anime.seasons?.map(season => (
            <div key={season._id}>
              <SeasonCard season={season} />
            </div>
          ))}
        </div>

        {/* =====================================================
            REVIEWS
            ===================================================== */}

        {/* Renders a review card for each review associated with the anime */}
        <p>Reviews:</p>
        <ul>
          {anime.reviews?.map(review => (
            <li key={review._id}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>

        {/* Navigation back to the home page */}
        <Button to="/">Back to home</Button>

      </Container>
    </div>
  )
}

export default Anime