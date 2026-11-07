/**
 * @file AddCharacter.js
 * @description Creates a character assigned to a specific anime.
 *              Character photos are not uploaded on this page.
 */

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import styles from './AddCharacter.module.scss'

/* =====================================================
   REDUX STATE MANAGEMENT
   ===================================================== */

import {
  createCharacterRequest,
} from '../../../redux/reducers/charactersRedux'

/* =====================================================
   CONTEXT
   ===================================================== */

import { useMessage } from '../../../context/MessageContext'

/* =====================================================
   COMPONENTS
   ===================================================== */

import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'
import CharacterForm from '../../features/CharacterForm/CharacterForm'

/* =====================================================
   ADD CHARACTER COMPONENT
   ===================================================== */

/**
 * @component
 * @description Creates a new character associated with a specific anime.
 *
 * @returns {JSX.Element} The add character page.
 */
const AddCharacter = () => {

  /* =====================================================
     ROUTING AND HOOKS
     ===================================================== */

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { t } = useTranslation()
  const { showMessage } = useMessage()

  /**
   * ID of the anime to which the new character will be assigned.
   * Retrieved from the URL query parameters.
   */
  const animeId = searchParams.get('animeId')

  /* =====================================================
     LOCAL STATE
     ===================================================== */

  /**
   * Indicates whether the character creation request is in progress.
   */
  const [isSaving, setIsSaving] = useState(false)

  /* =====================================================
     CREATE CHARACTER
     ===================================================== */

  /**
   * Creates a new character and assigns it to the selected anime.
   *
   * @param {Object} data - Character form data.
   */
  const handleAddCharacter = async data => {
    if (!animeId) {
      await showMessage({
        title: t('common.error'),
        message: t('addCharacter.missingAnimeId'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })

      return
    }

    setIsSaving(true)

    try {
      const createdCharacter = await dispatch(
        createCharacterRequest({
          ...data,
          anime: animeId,
        })
      )

      await showMessage({
        title: t('common.success'),
        message: t('addCharacter.saveSuccess'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })

      navigate(`/character/${createdCharacter._id}`)
    } catch (err) {
      await showMessage({
        title: t('common.error'),
        message:
          err.response?.data?.message ||
          t('addCharacter.saveFailed'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } finally {
      setIsSaving(false)
    }
  }

  /* =====================================================
     PAGE LAYOUT
     ===================================================== */

  /**
   * Displays an error message when no anime ID is provided.
   */
  if (!animeId) {
    return (
      <div className={styles.root}>
        <Container>
          <h1>{t('addCharacter.title')}</h1>

          <Button to="/">
            {t('common.home')}
          </Button>
        </Container>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <Container>

        <h1>{t('addCharacter.title')}</h1>

        <CharacterForm
          animeId={animeId}
          onSubmit={handleAddCharacter}
          submitText={t('addCharacter.submit')}
          isSaving={isSaving}
          backTo={`/anime/${animeId}`}
        />

      </Container>
    </div>
  )
}

export default AddCharacter
