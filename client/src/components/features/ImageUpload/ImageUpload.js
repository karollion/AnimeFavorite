
/* =====================================================
   Image Upload
   ===================================================== */

/**
 * @file ImageUpload.js
 * @description Reusable component for selecting, previewing,
 *              validating and uploading an image.
 */

/* =====================================================
   REACT HOOKS AND FORM MANAGEMENT
   ===================================================== */

import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

/* =====================================================
   UI COMPONENTS
   ===================================================== */

import { Form } from 'react-bootstrap'
import Button from '../../common/Button/Button'

/* =====================================================
   MESSAGE CONTEXT
   ===================================================== */

import { useMessage } from '../../../context/MessageContext'

/* =====================================================
   STYLES
   ===================================================== */

import styles from './ImageUpload.module.scss'

/* =====================================================
   IMAGE UPLOAD COMPONENT
   ===================================================== */

/**
 * @component
 * @description Provides a reusable image upload interface.
 *
 * The actual API request is supplied through the onUpload callback.
 *
 * @param {Object} props
 * @param {string} [props.currentImage] - URL of the current image.
 * @param {string} [props.currentImageAlt] - Alternative text for the current image.
 * @param {string} [props.title] - Section heading.
 * @param {string} [props.label] - File input label.
 * @param {Function} props.onUpload - Callback receiving the selected File.
 * @param {boolean} [props.isUploading] - Indicates an active upload.
 * @param {number} [props.maxSizeMB] - Maximum allowed image size in MB.
 * @param {string} [props.uploadButtonLabel] - Upload button text.
 * @param {string} [props.successMessage] - Custom success message.
 *
 * @returns {JSX.Element} Image upload interface.
 */
const ImageUpload = ({
  currentImage = '',
  currentImageAlt,
  title,
  label,
  onUpload,
  isUploading = false,
  maxSizeMB = 2,
  uploadButtonLabel,
  successMessage,
}) => {
  /* =====================================================
     HOOKS AND INITIALIZATION
     ===================================================== */

  const { t } = useTranslation()
  const { showMessage } = useMessage()

  const inputId = useId()
  const fileInputRef = useRef(null)

  /* =====================================================
     LOCAL COMPONENT STATE
     ===================================================== */

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')

  /* =====================================================
     IMAGE PREVIEW
     ===================================================== */

  /**
   * Creates a temporary URL for the selected image.
   * Releases the URL when the file changes or the component
   * unmounts to prevent unnecessary memory usage.
   */
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('')
      return undefined
    }

    const objectUrl = URL.createObjectURL(selectedFile)

    setPreviewUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  /* =====================================================
     FILE VALIDATION
     ===================================================== */

  /**
   * Validates the selected file before allowing upload.
   *
   * Supported formats: JPEG, PNG and WebP.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null

    setSelectedFile(null)
    setError('')

    if (!file) return

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    // Check whether the selected file has a supported image format.
    if (!allowedTypes.includes(file.type)) {
      setError(t('imageUpload.validation.invalidFormat'))
      event.target.value = ''
      return
    }

    // Check whether the selected file exceeds the size limit.
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(
        t('imageUpload.validation.maxSize', { maxSizeMB })
      )
      event.target.value = ''
      return
    }

    setSelectedFile(file)
  }

  /* =====================================================
     IMAGE UPLOAD
     ===================================================== */

  /**
   * Passes the selected file to the callback supplied
   * by the parent component.
   *
   * Displays a success or error message through MessageContext.
   */
  const handleUpload = async () => {
    if (!selectedFile || typeof onUpload !== 'function') return

    setError('')

    try {
      await onUpload(selectedFile)

      // Clear the selected file after a successful upload.
      setSelectedFile(null)

      // Reset the input so the same file can be selected again.
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Display upload confirmation.
      await showMessage({
        title: t('common.success'),
        message:
          successMessage || t('imageUpload.uploadSuccess'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    } catch (uploadError) {
      // Display the server error message or a translated fallback.
      await showMessage({
        title: t('common.error'),
        message:
          uploadError.response?.data?.message ||
          uploadError.message ||
          t('imageUpload.uploadFailed'),
        mode: 'alert',
        confirmText: t('common.ok'),
      })
    }
  }

  /* =====================================================
     COMPONENT RENDER
     ===================================================== */

  return (
    <section className={styles.root}>
      {/* Section heading */}
      <h2>
        {title || t('imageUpload.title')}
      </h2>

      {/* Currently uploaded image */}
      {currentImage ? (
        <div className={styles.imagePreview}>
          <p>{t('imageUpload.currentImage')}</p>

          <img
            src={currentImage}
            alt={currentImageAlt || t('imageUpload.currentImageAlt')}
          />
        </div>
      ) : (
        <p>{t('imageUpload.noImage')}</p>
      )}

      {/* Preview of the newly selected image */}
      {previewUrl && (
        <div className={styles.imagePreview}>
          <p>{t('imageUpload.selectedImage')}</p>

          <img
            src={previewUrl}
            alt={t('imageUpload.previewAlt')}
          />
        </div>
      )}

      {/* Image file selection */}
      <Form.Group className="mb-3">
        <Form.Label htmlFor={inputId}>
          {label || t('imageUpload.chooseImage')}
        </Form.Label>

        <Form.Control
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isUploading}
          isInvalid={!!error}
        />

        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>

        <Form.Text>
          {t('imageUpload.allowedFormats', { maxSizeMB })}
        </Form.Text>
      </Form.Group>

      {/* Upload action */}
      <Button
        type="button"
        active={!!selectedFile && !isUploading}
        action={handleUpload}
      >
        {isUploading
          ? t('imageUpload.uploading')
          : uploadButtonLabel || t('imageUpload.uploadButton')}
      </Button>
    </section>
  )
}

/* =====================================================
   PROP TYPES
   ===================================================== */

ImageUpload.propTypes = {
  currentImage: PropTypes.string,
  currentImageAlt: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  onUpload: PropTypes.func.isRequired,
  isUploading: PropTypes.bool,
  maxSizeMB: PropTypes.number,
  uploadButtonLabel: PropTypes.string,
  successMessage: PropTypes.string,
}

export default ImageUpload
