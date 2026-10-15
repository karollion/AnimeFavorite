/* =====================================================
   ANIME COVER UPLOAD
   ===================================================== */

/**
 * @file AnimeCoverUpload.js
 * @description Separate component for displaying the current
 *              anime cover and uploading a replacement image.
 */

import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from '../../common/Button/Button';
import styles from './AnimeForm.module.scss';

/**
 * @component
 * @description Allows an administrator to select and upload
 *              a replacement anime cover independently of
 *              the anime information form.
 *
 * @param {Object} props
 * @param {Object} props.anime - Anime whose cover is edited.
 * @param {Function} props.onUpload - Callback receiving the selected file.
 * @param {boolean} props.isUploading - Indicates an active upload.
 *
 * @returns {JSX.Element}
 */
const AnimeCoverUpload = ({
  anime,
  onUpload,
  isUploading = false,
}) => {
  const [coverFile, setCoverFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);

  /**
   * Release temporary preview URLs when the selected file changes
   * or the component is unmounted.
   */
  useEffect(() => {
    if (!coverFile) {
      setPreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(coverFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [coverFile]);

  /**
   * Validate the selected image before uploading it.
   *
   * Supported formats: JPEG, PNG, WebP.
   * Maximum file size: 2 MB.
   */
  const handleFileChange = event => {
    const file = event.target.files?.[0] || null;

    setCoverFile(null);
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

    if (file.size > 2 * 1024 * 1024) {
      setError('The image must not exceed 2 MB.');
      event.target.value = '';
      return;
    }

    setCoverFile(file);
  };

  /**
   * Upload the selected cover through the callback provided
   * by EditAnime.
   */
  const handleUpload = async () => {
     console.log('Kliknięto przycisk uploadu');
  console.log('Wybrany plik:', coverFile);
  console.log('onUpload:', onUpload);
    if (!coverFile || typeof onUpload !== 'function') return;

    setError('');
    setStatus(null);

    try {
      await onUpload(coverFile);

      setCoverFile(null);
      setStatus({
        type: 'success',
        message: 'Anime cover updated successfully.',
      });
    } catch (uploadError) {
      setStatus({
        type: 'error',
        message:
          uploadError.response?.data?.message ||
          'Failed to upload anime cover.',
      });
    }
  };

  return (
    <section className={styles.coverSection}>
      <h2>Anime cover</h2>

      {/* Current cover */}
      {anime?.anime_cover ? (
        <div className={styles.coverPreview}>
          <p>Current cover:</p>
          <img
            src={anime.anime_cover}
            alt={`${anime.title} cover`}
          />
        </div>
      ) : (
        <p>No cover uploaded.</p>
      )}

      {/* Preview of the selected replacement */}
      {previewUrl && (
        <div className={styles.coverPreview}>
          <p>Selected cover:</p>
          <img src={previewUrl} alt="Selected anime cover preview" />
        </div>
      )}

      {/* Image selection */}
      <Form.Group className="mb-3">
        <Form.Label>Choose a new cover</Form.Label>

        <Form.Control
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
          JPG, PNG or WebP. Maximum size: 2 MB.
        </Form.Text>
      </Form.Group>

      {/* Upload action */}
      <Button
        type="button"
        active={!!coverFile && !isUploading}
        action={handleUpload}
      >
        {isUploading ? 'Uploading...' : 'Upload cover'}
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

export default AnimeCoverUpload;