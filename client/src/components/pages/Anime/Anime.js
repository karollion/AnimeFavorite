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
import { useEffect } from 'react'

/* =====================================================
   REDUX STATE MANAGEMENT
   ===================================================== */

import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAnimeBySlug,
  getSelectedAnime,
  getAnimesLoading,
  getAnimesError
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
        <p>Rating avg: {anime.rating_avg}</p>
        <p>Rating count: {anime.rating_count}</p>
        <p>Description: {anime.description_short}</p>

        {/* Anime editing action available only to administrators */}
        {user?.role === 'admin' && (
          <Button to={"/anime/EditAnime/" + anime.slug}>Edit</Button>
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