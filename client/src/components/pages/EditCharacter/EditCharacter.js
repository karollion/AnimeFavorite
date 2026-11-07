/**
 * @file EditCharacter.js
 * @description Page component for editing an existing character.
 *              Allows updating character details and uploading a photo
 *              independently.
 */

// Styles
import styles from './EditCharacter.module.scss'

// React
import { useEffect, useState } from 'react'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCharacterById,
  getSelectedCharacter,
  updateCharacterRequest,
  updateCharacterPhotoRequest,
} from '../../../redux/reducers/charactersRedux'

// Routing
import { useNavigate, useParams } from 'react-router-dom'

// Translations and messages
import { useTranslation } from 'react-i18next'
import { useMessage } from '../../../context/MessageContext'

// UI components
import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'
import CharacterForm from '../../features/CharacterForm/CharacterForm'
import ImageUpload from '../../features/ImageUpload/ImageUpload'

const EditCharacter = () => {
  const { t } = useTranslation()
  const { showMessage } = useMessage()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  // Retrieve the selected character from Redux.
  const selectedCharacter = useSelector(getSelectedCharacter)

  // Prevent displaying a previously selected character with a different ID.
  const character = selectedCharacter?._id === id
    ? selectedCharacter
    : null

  // Request and upload states.
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)

  /**
   * Loads the character selected for editing.
   * Prevents state updates after the component has been unmounted.
   */
  useEffect(() => {
    let isMounted = true

    const loadCharacter = async () => {
      setIsLoading(true)
      setLoadFailed(false)

      try {
        await dispatch(fetchCharacterById(id))
      } catch (error) {
        if (isMounted) {
          setLoadFailed(true)
          setIsLoading(false)

          await showMessage({
            title: t('common.error'),
            message: error.response?.data?.message ||
              t('editCharacter.loadFailed'),
            mode: 'alert',
            confirmText: t('common.ok'),
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (id) {
      loadCharacter()
    } else {
      setLoadFailed(true)
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [dispatch, id, showMessage, t])

  /**
   * Updates the character's text information.
   *
   * @param {Object} data - Updated character form values.
   */
  const handleUpdateCharacter = async data => {
    if (!id) return

    setIsSaving(true)

    try {
      await dispatch(updateCharacterRequest(id, data))

      await showMessage({
        title: t('common.success'),
        message: t('editCharacter.saveSuccess'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (error) {
      await showMessage({
        title: t('common.error'),
        message: error.response?.data?.message ||
          t('editCharacter.saveFailed'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Uploads a new character photo independently of the text form.
   *
   * @param {File} file - Selected image file.
   */
  const handleUploadPhoto = async file => {
    if (!id) return

    setIsUploading(true)

    try {
      await dispatch(updateCharacterPhotoRequest(id, file))

      await showMessage({
        title: t('common.success'),
        message: t('editCharacter.photoSuccess'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (error) {
      await showMessage({
        title: t('common.error'),
        message: error.response?.data?.message ||
          t('editCharacter.photoFailed'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })

      // Propagate the error so ImageUpload can handle the failed request.
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  /**
   * Navigates back to the previous page.
   */
  const handleGoBack = () => {
    navigate(-1)
  }

  // Display a loading indicator while the character is being fetched.
  if (isLoading) {
    return (
      <div className={styles.root}>
        <Container>
          <p>{t('editCharacter.loading')}</p>
        </Container>
      </div>
    )
  }

  // Handle missing or unavailable character data.
  if (!character) {
    return (
      <div className={styles.root}>
        <Container>

          <h1 className={styles.title}>
            {t('editCharacter.title')}
          </h1>

          <p className="text-danger" role="alert">
            {loadFailed
              ? t('editCharacter.unavailable')
              : t('editCharacter.notFound')}
          </p>

          <Button action={handleGoBack}>
            {t('editCharacter.back')}
          </Button>

        </Container>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <Container>

        {/* Main page heading */}
        <h1 className={styles.title}>
          {t('editCharacter.title')}
        </h1>

        {/* Character text information */}
        <section className={styles.formSection}>

          <h2>
            {t('editCharacter.detailsTitle')}
          </h2>

          <CharacterForm
            character={character}
            onSubmit={handleUpdateCharacter}
            submitText={t('editCharacter.saveChanges')}
            isSaving={isSaving}
            backTo={`/character/${character._id}`}
          />

        </section>

        {/* Character photo management */}
        <section className={styles.photoSection}>

          <ImageUpload
            title={t('editCharacter.photoTitle')}
            label={t('editCharacter.choosePhoto')}
            currentImage={character.photo}
            currentImageAlt={t('editCharacter.photoAlt', {
              name: character.firstName,
            })}
            onUpload={handleUploadPhoto}
            isUploading={isUploading}
            maxSizeMB={2}
            uploadButtonLabel={t('editCharacter.uploadPhoto')}
            successMessage={t('editCharacter.photoSuccess')}
          />

        </section>

      </Container>
    </div>
  )
}

export default EditCharacter
