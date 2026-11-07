/**
 * @file EditAnime.js
 * @description Allows administrators to edit an existing anime entry.
 *              Fetches anime data by slug and provides functionality
 *              for updating anime details and its cover image.
 */

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import styles from './EditAnime.module.scss'

/* =====================================================
   REDUX STATE MANAGEMENT
   ===================================================== */

import {
  fetchAnimeBySlug,
  getSelectedAnime,
  getAnimesLoading,
  getAnimesError,
  updateAnimeRequest,
  updateAnimeCoverRequest,
} from '../../../redux/reducers/animesRedux'

/* =====================================================
   CONTEXT
   ===================================================== */

import { useMessage } from '../../../context/MessageContext'

/* =====================================================
   COMPONENTS
   ===================================================== */

import AnimeForm from '../../features/AnimeForm/AnimeForm'
import Container from '../../common/container/Container'
import ImageUpload from '../../features/ImageUpload/ImageUpload'

/* =====================================================
   EDIT ANIME COMPONENT
   ===================================================== */

/**
 * @component
 * @description Fetches and displays an anime entry for editing.
 *              Allows updating anime information and uploading
 *              a replacement cover image.
 *
 * @returns {JSX.Element} The edit anime page.
 */
const EditAnime = () => {
  const { slug } = useParams()

  const dispatch = useDispatch()

  const { t } = useTranslation()
  const { showMessage } = useMessage()

  /* =====================================================
     LOCAL STATE
     ===================================================== */

  // Tracks the anime details update process.
  const [isSaving, setIsSaving] = useState(false)

  // Tracks the cover image upload process.
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  /* =====================================================
     REDUX SELECTORS
     ===================================================== */

  const loading = useSelector(getAnimesLoading)
  const anime = useSelector(getSelectedAnime)
  const error = useSelector(getAnimesError)

  /* =====================================================
     DATA FETCHING
     ===================================================== */

  /**
   * Fetches anime details whenever the URL slug changes.
   * Skips the request if no slug is available.
   *
   * @dependency dispatch - Redux dispatch function.
   * @dependency slug - Slug identifying the requested anime.
   */
  useEffect(() => {
    if (!slug) return

    dispatch(fetchAnimeBySlug(slug))
  }, [dispatch, slug])

  /* =====================================================
     ANIME UPDATE HANDLER
     ===================================================== */

  /**
   * Updates anime information and optionally uploads a new cover.
   * Refreshes the selected anime after successful updates.
   *
   * @param {Object} data - Updated anime form data.
   * @param {File|null} cover - Optional replacement cover image.
   * @returns {Promise<void>}
   */
  const handleEditAnime = async (data, cover) => {
    if (!anime?._id) return

    setIsSaving(true)

    try {
      // Update the anime information.
      await dispatch(updateAnimeRequest({
        ...data,
        _id: anime._id,
      }))

      // Upload a replacement cover if provided by the form.
      if (cover) {
        await dispatch(updateAnimeCoverRequest(anime._id, cover))
      }

      // Fetch the updated anime data.
      await dispatch(fetchAnimeBySlug(slug))

      // Notify the user about the successful update.
      await showMessage({
        title: t('common.success'),
        message: t('editAnime.saveSuccess'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (err) {
      // Display the server error or a translated fallback message.
      await showMessage({
        title: t('common.error'),
        message:
          err.response?.data?.message ||
          t('editAnime.saveFailed'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } finally {
      setIsSaving(false)
    }
  }

  /* =====================================================
     ANIME COVER UPLOAD HANDLER
     ===================================================== */

  /**
   * Uploads a replacement cover image and refreshes anime data.
   *
   * @param {File} cover - Selected cover image file.
   * @returns {Promise<void>}
   */
  const handleUploadCover = async cover => {
    if (!anime?._id || !cover) return

    setIsUploadingCover(true)

    try {
      // Upload the replacement cover image.
      await dispatch(updateAnimeCoverRequest(anime._id, cover))

      // Refresh the anime to display the updated cover.
      await dispatch(fetchAnimeBySlug(slug))

      // Notify the user about the successful upload.
      await showMessage({
        title: t('common.success'),
        message: t('editAnime.coverSuccess'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (err) {
      // Display the server error or a translated fallback message.
      await showMessage({
        title: t('common.error'),
        message:
          err.response?.data?.message ||
          t('editAnime.coverFailed'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })

      // Propagate the error to the ImageUpload component.
      throw err
    } finally {
      setIsUploadingCover(false)
    }
  }

  /* =====================================================
     LOADING AND ERROR HANDLING
     ===================================================== */

  // Display a loading message while fetching anime data.
  if (loading) {
    return <p>{t('editAnime.loading')}</p>
  }

  // Display an error if the anime request has failed.
  if (error) {
    return (
      <p>
        {t('common.error')}: {error}
      </p>
    )
  }

  // Display a fallback message if the requested anime does not exist.
  if (!anime) {
    return <p>{t('editAnime.notFound')}</p>
  }

  /* =====================================================
     EDIT ANIME FORM
     ===================================================== */

  return (
    <div className={styles.root}>
      <Container>

        {/* Page heading */}
        <h1>{t('editAnime.title')}</h1>

        {/* Title of the anime currently being edited */}
        <h3>{anime.title}</h3>

        {/* Anime details editing form */}
        <AnimeForm
          anime={anime}
          onSubmit={handleEditAnime}
          submitText={t('editAnime.saveChanges')}
          isSaving={isSaving}
        />

        {/* Separate anime cover upload section */}
        <ImageUpload
          title={t('editAnime.coverTitle')}
          label={t('editAnime.chooseCover')}
          currentImage={anime.anime_cover}
          currentImageAlt={t('editAnime.coverAlt', {
            title: anime.title,
          })}
          onUpload={handleUploadCover}
          isUploading={isUploadingCover}
          maxSizeMB={2}
          uploadButtonLabel={t('editAnime.uploadCover')}
        />

      </Container>
    </div>
  )
}

export default EditAnime
