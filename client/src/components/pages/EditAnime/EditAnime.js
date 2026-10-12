/* =====================================================
   Edit Anime Page
   ===================================================== */

/**
 * @file EditAnime.js
 * @description Page component for editing an existing anime entity.
 *              Fetches anime data by slug and displays its title together
 *              with the reusable AnimeForm component pre-filled with
 *              the selected anime's data.
 */

import styles from './EditAnime.module.scss'

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

/* =====================================================
   COMPONENTS
   ===================================================== */

import AnimeForm from '../../features/AnimeForm/AnimeForm'
import Container from '../../common/container/Container'

/* =====================================================
   EDIT ANIME COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders the page for editing an existing anime entry.
 *              Retrieves the anime slug from the URL, fetches the
 *              corresponding anime data through Redux, and passes the
 *              selected anime to AnimeForm for editing.
 *
 * @returns {JSX.Element} The edit anime page.
 */
const EditAnime = () => {

  /* =====================================================
     ROUTE PARAMETERS
     ===================================================== */

  /**
   * Slug identifying the anime to be edited.
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

  /* =====================================================
     DATA FETCHING
     ===================================================== */

  /**
   * Fetches anime details whenever the URL slug changes.
   * Skips the request if no slug is available.
   *
   * @dependency dispatch - Redux dispatch function.
   * @dependency slug - Identifier of the anime to be edited.
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
     EDIT ANIME FORM
     ===================================================== */

  return (
    <div className={styles.root}>
      <Container>

        {/* Page heading */}
        <h1>Edit anime</h1>

        {/* Title of the anime currently being edited */}
        <h3>{anime.title}</h3>

        {/* Form initialized with the selected anime's data */}
        <AnimeForm anime={anime} />

      </Container>
    </div>
  )
}

export default EditAnime