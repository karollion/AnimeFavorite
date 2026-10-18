/* =====================================================
   Character Page
   ===================================================== */

/**
 * @file Character.js
 * @description Page component for displaying detailed information about
 *              a single character entity.
 *              Fetches character data by ID and displays its personal
 *              information, photo, and associated anime title.
 */

import styles from './Character.module.scss'

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
  fetchCharacterById,
  getCharactersError,
  getCharactersLoading,
  getSelectedCharacter
} from '../../../redux/reducers/charactersRedux'

/* =====================================================
   COMPONENTS AND ASSETS
   ===================================================== */

import noImage from '../../../assets/no-image.png'
import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'

/* =====================================================
   CHARACTER COMPONENT
   ===================================================== */

/**
 * @component
 * @description Displays detailed information about the selected character.
 *              Retrieves the character ID from the URL and fetches the
 *              corresponding character data through Redux.
 *
 * @returns {JSX.Element} The character details page.
 */
const Character = () => {

  /* =====================================================
     ROUTE PARAMETERS
     ===================================================== */

  /**
   * ID identifying the character in the current URL.
   * @type {string | undefined}
   */
  const { id } = useParams()

  /* =====================================================
     REDUX STATE AND DISPATCH
     ===================================================== */

  /**
   * Redux dispatch function used to trigger character data requests.
   */
  const dispatch = useDispatch()

  /**
   * Indicates whether character data is currently being loaded.
   */
  const loading = useSelector(getCharactersLoading)

  /**
   * Character entity currently selected in the Redux store.
   */
  const character = useSelector(getSelectedCharacter)

  /**
   * Error returned by the character data fetching process, if any.
   */
  const error = useSelector(getCharactersError)

  /* =====================================================
     DATA FETCHING
     ===================================================== */

  /**
   * Fetches character details whenever the URL ID changes.
   * Skips the request if no ID is available.
   *
   * @dependency dispatch - Redux dispatch function.
   * @dependency id - Identifier of the requested character.
   */
  useEffect(() => {
    if (!id) return
    dispatch(fetchCharacterById(id))
  }, [dispatch, id])

  /* =====================================================
     LOADING AND ERROR HANDLING
     ===================================================== */

  /**
   * Displays a loading message while the request is in progress
   * or while the selected character data is not yet available.
   */
  if (loading || !character) return <p>Loading...</p>

  /**
   * Displays an error message if the character request has failed.
   */
  if (error) return <p>Error: {error}</p>

  /* =====================================================
     CHARACTER DETAILS
     ===================================================== */

  return (
    <div className={styles.root}>
      <Container>

        {/* Title of the anime associated with the character */}
        <h1>{character.anime?.title}</h1>

        {/* Character photo with a fallback image when no photo is available */}
        <img
          src={character.photo || noImage}
          alt={character.firstName}
          className={styles.img}
        />

        {/* Basic character information */}
        <p>First Name:  {character.firstName}</p>
        <p>Last Name: {character.lastName}</p>
        <p>Gender: {character.gender}</p>
        <p>Role: {character.role}</p>
        <p>Species: {character.species}</p>
        <p>Age: {character.age}</p>
        <p>OriginWorld: {character.originWorld}</p>
        <p>Description: {character.description}</p>

         <Button to="/">Edit</Button>
        {/* Navigation back to the home page */}
        <Button to="/">Back to home</Button>

      </Container>
    </div>
  )
}

export default Character