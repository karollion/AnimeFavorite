/**
 * @file Character.js
 * @description Displays detailed information about a single character.
 *              Fetches character data by ID and displays personal
 *              information, photo, and associated anime title.
 */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import styles from './Character.module.scss'

/* =====================================================
   REDUX STATE MANAGEMENT
   ===================================================== */

import {
  fetchCharacterById,
  getCharactersError,
  getCharactersLoading,
  getSelectedCharacter,
} from '../../../redux/reducers/charactersRedux'

import { getUser } from '../../../redux/reducers/userRedux'

/* =====================================================
   COMPONENTS AND ASSETS
   ===================================================== */

import noImage from '../../../assets/no-image.png'
import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'

/* =====================================================
   HELPER FUNCTIONS
   ===================================================== */

/**
 * Returns a displayable value or a fallback for empty fields.
 *
 * @param {*} value - Value to display.
 * @returns {*} Original value or a fallback character.
 */
const getDisplayValue = value => {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  return value
}

/* =====================================================
   CHARACTER COMPONENT
   ===================================================== */

/**
 * @component
 * @description Displays detailed information about the selected character.
 *              Retrieves the character ID from the URL and fetches the
 *              corresponding data through Redux.
 *
 * @returns {JSX.Element} The character details page.
 */
const Character = () => {

  /* =====================================================
     ROUTE PARAMETERS
     ===================================================== */

  /**
   * ID identifying the character in the current URL.
   */
  const { id } = useParams()

  /* =====================================================
     HOOKS AND REDUX STATE
     ===================================================== */

  const dispatch = useDispatch()
  const { t } = useTranslation()

  /**
   * Currently authenticated user's data.
   * Used to determine whether administrative actions are available.
   */
  const user = useSelector(getUser)

  /**
   * Indicates whether character data is currently being loaded.
   */
  const loading = useSelector(getCharactersLoading)

  /**
   * Character entity currently selected in the Redux store.
   */
  const character = useSelector(getSelectedCharacter)

  /**
   * Error returned by the character fetching process, if any.
   */
  const error = useSelector(getCharactersError)

  /**
   * Ensures that the selected character matches the ID from the URL.
   * Prevents displaying previously selected character data.
   */
  const selectedCharacter =
    character?._id === id ? character : null

  /* =====================================================
     DATA FETCHING
     ===================================================== */

  /**
   * Fetches character details whenever the URL ID changes.
   * Skips the request if no ID is available.
   */
  useEffect(() => {
    if (!id) return

    dispatch(fetchCharacterById(id))
  }, [dispatch, id])

  /* =====================================================
     LOADING AND ERROR HANDLING
     ===================================================== */

  /**
   * Displays a loading message while the request is in progress.
   */
  if (loading) {
    return <p>{t('character.loading')}</p>
  }

  /**
   * Displays an error message if the character request has failed.
   */
  if (error) {
    return <p>{t('common.error')}: {error}</p>
  }

  /**
   * Displays a not-found message when the requested character
   * is not available in the Redux store.
   */
  if (!selectedCharacter) {
    return <p>{t('character.notFound')}</p>
  }

  /* =====================================================
     CHARACTER DETAILS
     ===================================================== */

  return (
    <div className={styles.root}>
      <Container>

        {/* Title of the anime associated with the character */}
        <h1>
          {getDisplayValue(selectedCharacter.anime?.title)}
        </h1>

        {/* Character photo with a fallback image */}
        <img
          src={selectedCharacter.photo || noImage}
          alt={selectedCharacter.firstName || t('character.photoAlt')}
          className={styles.img}
        />

        {/* Basic character information */}
        <p>
          {t('character.firstName')}: {' '}
          {getDisplayValue(selectedCharacter.firstName)}
        </p>

        <p>
          {t('character.lastName')}: {' '}
          {getDisplayValue(selectedCharacter.lastName)}
        </p>

        <p>
          {t('character.gender.label')}: {' '}
          {t(`character.gender.${selectedCharacter.gender}`, {
            defaultValue: getDisplayValue(selectedCharacter.gender),
          })}
        </p>

        <p>
          {t('character.role.label')}: {' '}
          {t(`character.role.${selectedCharacter.role}`, {
            defaultValue: getDisplayValue(selectedCharacter.role),
          })}
        </p>

        <p>
          {t('character.species')}: {' '}
          {getDisplayValue(selectedCharacter.species)}
        </p>

        <p>
          {t('character.age')}: {' '}
          {getDisplayValue(selectedCharacter.age)}
        </p>

        <p>
          {t('character.originWorld')}: {' '}
          {getDisplayValue(selectedCharacter.originWorld)}
        </p>

        <p>
          {t('character.description')}: {' '}
          {getDisplayValue(selectedCharacter.description)}
        </p>

        {/* Character editing action available only to administrators */}
        {user?.role === 'admin' && (
          <div>
            <Button to={`/character/${selectedCharacter._id}/edit`}>
              {t('character.editCharacter')}
            </Button>
          </div>
        )}

        {/* Navigation back to the home page */}
        <Button to="/">
          {t('character.backToHome')}
        </Button>

      </Container>
    </div>
  )
}

export default Character
