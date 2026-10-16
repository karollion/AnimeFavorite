
/* =====================================================
   IMAGE UPLOAD
   ===================================================== */

/**
 * @file ImageUpload.js
 * @description Reusable component for selecting, previewing,
 *              validating and uploading an image.
 */

import { useEffect, useId, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from '../../common/Button/Button';
import styles from './ImageUpload.module.scss';

/**
 * @component
 * @description Provides a reusable image upload interface.
 *              The actual API request is supplied through onUpload.
 *
 * @param {Object} props
 * @param {string} props.currentImage - URL of the current image.
 * @param {string} props.currentImageAlt - Alternative text for the current image.
 * @param {string} props.title - Section heading.
 * @param {string} props.label - File input label.
 * @param {Function} props.onUpload - Callback receiving the selected File.
 * @param {boolean} props.isUploading - Indicates an active upload.
 * @param {number} props.maxSizeMB - Maximum allowed image size in MB.
 * @param {string} props.uploadButtonLabel - Upload button text.
 * @param {string} props.successMessage - Message displayed after success.
 *
 * @returns {JSX.Element}
 */
const ImageUpload = ({
  currentImage = '',
  currentImageAlt = 'Current image',
  title = 'Image',
  label = 'Choose an image',
  onUpload,
  isUploading = false,
  maxSizeMB = 2,
  uploadButtonLabel = 'Upload image',
  successMessage = 'Image uploaded successfully.',
}) => {
  const inputId = useId();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);

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
      setPreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  /* =====================================================
     FILE VALIDATION
     ===================================================== */

  /**
   * Validates the selected file before allowing upload.
   * Supported formats: JPEG, PNG and WebP.
   */
  const handleFileChange = event => {
    const file = event.target.files?.[0] || null;

    setSelectedFile(null);
    setError('');
    setStatus(null);

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Choose a JPG, PNG or WebP image.');
      event.target.value = '';
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`The image must not exceed ${maxSizeMB} MB.`);
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  /* =====================================================
     IMAGE UPLOAD
     ===================================================== */

  /**
   * Passes the selected file to the callback supplied
   * by the parent component.
   */
  const handleUpload = async () => {
    if (!selectedFile || typeof onUpload !== 'function') return;

    setError('');
    setStatus(null);

    try {
      await onUpload(selectedFile);

      setSelectedFile(null);

      // Reset the file input so the same file can be selected again.
      const fileInput = document.getElementById(inputId);
      if (fileInput) fileInput.value = '';

      setStatus({
        type: 'success',
        message: successMessage,
      });
    } catch (uploadError) {
      setStatus({
        type: 'error',
        message:
          uploadError.response?.data?.message ||
          uploadError.message ||
          'Failed to upload image.',
      });
    }
  };

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <section className={styles.root}>
      <h2>{title}</h2>

      {/* Current image */}
      {currentImage ? (
        <div className={styles.imagePreview}>
          <p>Current image:</p>
          <img src={currentImage} alt={currentImageAlt} />
        </div>
      ) : (
        <p>No image uploaded.</p>
      )}

      {/* Selected image preview */}
      {previewUrl && (
        <div className={styles.imagePreview}>
          <p>Selected image:</p>
          <img src={previewUrl} alt="Preview" />
        </div>
      )}

      {/* File selection */}
      <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>

        <Form.Control
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
          JPG, PNG or WebP. Maximum size: {maxSizeMB} MB.
        </Form.Text>
      </Form.Group>

      {/* Upload action */}
      <Button
        type="button"
        active={!!selectedFile && !isUploading}
        action={handleUpload}
      >
        {isUploading ? 'Uploading...' : uploadButtonLabel}
      </Button>

      {/* Upload feedback */}
      {status && (
        <p
          className={
            status.type === 'success'
              ? styles.success
              : styles.error
          }
          role={status.type === 'success' ? 'status' : 'alert'}
        >
          {status.message}
        </p>
      )}
    </section>
  );
};

export default ImageUpload;
