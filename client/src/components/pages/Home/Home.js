/* =====================================================
   Home Page
   ===================================================== */

/**
 * @file Home.js
 * @description Main page component of the application.
 *              Fetches home page data through Redux and displays anime
 *              collections grouped by category, including newest releases,
 *              top-rated anime, random selections, movies, and TV series.
 */

import styles from './Home.module.scss'

/* =====================================================
   REACT HOOKS AND REDUX STATE MANAGEMENT
   ===================================================== */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHome } from '../../../redux/reducers/homeSliceRedux'

/* =====================================================
   COMPONENTS
   ===================================================== */

import AnimeSection from '../../features/AnimeSection/AnimeSection'
import Container from '../../common/container/Container'

/* =====================================================
   HOME COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders the main page with multiple anime collections.
 *              Retrieves home page data from the Redux store and dispatches
 *              a request to fetch the collections when the component mounts.
 *
 * @returns {JSX.Element} The home page containing anime sections.
 */
const Home = () => {

  /* =====================================================
     REDUX STATE AND DISPATCH
     ===================================================== */

  /**
   * Redux dispatch function used to trigger the home page data request.
   */
  const dispatch = useDispatch()

  /**
   * Anime collections and loading state retrieved from the home Redux slice.
   *
   * @property {Array} newest - Newest anime entries.
   * @property {Array} topRated - Highest-rated anime entries.
   * @property {Array} films - Anime movies.
   * @property {Array} tvSeries - Anime TV series.
   * @property {Array} random - Randomly selected anime entries.
   * @property {boolean} loading - Indicates whether home page data is loading.
   */
  const {
    newest,
    topRated,
    films,
    tvSeries,
    random,
    loading,
  } = useSelector(state => state.home)

  /* =====================================================
     DATA FETCHING
     ===================================================== */

  /**
   * Fetches home page data when the component mounts.
   *
   * @dependency dispatch - Redux dispatch function.
   */
  useEffect(() => {
    dispatch(fetchHome())
  }, [dispatch])

  /* =====================================================
     LOADING HANDLING
     ===================================================== */

  /**
   * Optional loading indicator.
   * Currently disabled; can be enabled to display a loading message
   * while home page data is being fetched.
   */
  // if (loading) return <p>Loading...</p>

  /* =====================================================
     HOME PAGE CONTENT
     ===================================================== */

  return (
    <div className={styles.root}>
      <Container>
        <div>

          {/* Displays the newest anime entries */}
          <AnimeSection title="New Animes" animes={newest} />

          {/* Displays the highest-rated anime entries */}
          <AnimeSection title="Top Rated" animes={topRated} />

          {/* Displays randomly selected anime entries */}
          <AnimeSection title="Random" animes={random} />

          {/* Displays anime movies */}
          <AnimeSection title="Movies" animes={films} />

          {/* Displays anime TV series */}
          <AnimeSection title="TV series" animes={tvSeries} />

        </div>
      </Container>
    </div>
  )
}

export default Home