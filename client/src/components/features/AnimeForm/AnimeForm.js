/* =====================================================
   ANIME FORM
   ===================================================== */

/**
 * @file AnimeForm.js
 * @description Reusable form for creating and editing anime information.
 *              Cover uploads are handled separately by AnimeCoverUpload.
 */

import styles from './AnimeForm.module.scss';
import { useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Button from '../../common/Button/Button';
import { useForm } from 'react-hook-form';

/**
 * @component
 * @description Renders the anime information form.
 *
 * @param {Object} props
 * @param {Object|null} props.anime - Anime data used to populate edit fields.
 * @param {Function} props.onSubmit - Callback receiving the anime payload.
 * @param {string} props.submitText - Submit button label.
 * @param {boolean} props.isSaving - Indicates whether the form is saving.
 * @param {boolean} props.showCoverUpload - Reserved for controlling
 *        cover-related UI in the parent. Cover uploads are intentionally
 *        handled by a separate component.
 *
 * @returns {JSX.Element}
 */
const AnimeForm = ({
  anime = null,
  onSubmit,
  submitText = 'Save',
  isSaving = false,
}) => {

  /* =====================================================
     FORM INITIALIZATION
     ===================================================== */

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      original_title: '',
      age_rating: 0,
      type: '',
      world: '',
      genres: '',
      categories: '',
      description_short: '',
    },
  });

  /* =====================================================
     FORM DATA SYNCHRONIZATION
     ===================================================== */

  useEffect(() => {
    reset({
      title: anime?.title || '',
      original_title: anime?.original_title || '',
      age_rating: anime?.age_rating ?? 0,
      type: anime?.type || '',
      world: anime?.world || '',
      genres: anime?.genres?.join(', ') || '',
      categories: anime?.categories?.join(', ') || '',
      description_short: anime?.description_short || '',
    });
  }, [anime, reset]);

  /* =====================================================
     FORM SUBMISSION
     ===================================================== */

  /**
   * Converts form values into the payload expected by the API.
   * No image file is included in this request.
   */
  const handleFormSubmit = async data => {
    const payload = {
      ...data,
      age_rating: Number(data.age_rating),
      genres: data.genres
        .split(',')
        .map(value => value.trim())
        .filter(Boolean),
      categories: data.categories
        .split(',')
        .map(value => value.trim())
        .filter(Boolean),
    };

    if (typeof onSubmit !== 'function') {
      console.error('AnimeForm requires an onSubmit function.');
      return;
    }

    await onSubmit(payload);
  };

  /* =====================================================
     FORM RENDERING
     ===================================================== */

  return (
    <Form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={styles.root}
    >
      {/* TITLE */}
      <Form.Group className="mb-3">
        <Form.Label>Title *</Form.Label>

        <Form.Control
          {...register('title', {
            required: 'Title is required.',
            minLength: {
              value: 5,
              message: 'Title must have at least 5 characters.',
            },
            maxLength: {
              value: 70,
              message: 'Title cannot exceed 70 characters.',
            },
          })}
          isInvalid={!!errors.title}
          placeholder="Enter title"
        />

        <Form.Control.Feedback type="invalid">
          {errors.title?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* ORIGINAL TITLE */}
      <Form.Group className="mb-3">
        <Form.Label>Original title</Form.Label>

        <Form.Control
          {...register('original_title', {
            minLength: {
              value: 2,
              message: 'Original title must have at least 2 characters.',
            },
            maxLength: {
              value: 70,
              message: 'Original title cannot exceed 70 characters.',
            },
          })}
          isInvalid={!!errors.original_title}
          placeholder="Original title"
        />

        <Form.Control.Feedback type="invalid">
          {errors.original_title?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* AGE RATING */}
      <Form.Group className="mb-3">
        <Form.Label>Age rating *</Form.Label>

        <Form.Control
          type="number"
          {...register('age_rating', {
            required: 'Age rating is required.',
            valueAsNumber: true,
            min: {
              value: 0,
              message: 'Minimum age rating is 0.',
            },
            max: {
              value: 21,
              message: 'Maximum age rating is 21.',
            },
            validate: value =>
              Number.isInteger(value) || 'Enter a whole number.',
          })}
          isInvalid={!!errors.age_rating}
        />

        <Form.Control.Feedback type="invalid">
          {errors.age_rating?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* TYPE */}
      <Form.Group className="mb-3">
        <Form.Label>Type *</Form.Label>

        <Form.Select
          {...register('type', {
            required: 'Choose an anime type.',
          })}
          isInvalid={!!errors.type}
        >
          <option value="">-- choose --</option>
          <option value="TV">TV</option>
          <option value="Movie">Movie</option>
          <option value="OVA">OVA</option>
          <option value="ONA">ONA</option>
        </Form.Select>

        <Form.Control.Feedback type="invalid">
          {errors.type?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* WORLD */}
      <Form.Group className="mb-3">
        <Form.Label>World</Form.Label>

        <Form.Control
          {...register('world', {
            maxLength: {
              value: 30,
              message: 'World cannot exceed 30 characters.',
            },
          })}
          isInvalid={!!errors.world}
        />

        <Form.Control.Feedback type="invalid">
          {errors.world?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* GENRES */}
      <Form.Group className="mb-3">
        <Form.Label>Genres *</Form.Label>

        <Form.Control
          {...register('genres', {
            required: 'Enter at least one genre.',
            validate: value =>
              value.split(',').some(item => item.trim()) ||
              'Enter at least one genre.',
          })}
          isInvalid={!!errors.genres}
          placeholder="action, fantasy, drama"
        />

        <Form.Control.Feedback type="invalid">
          {errors.genres?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* CATEGORIES */}
      <Form.Group className="mb-3">
        <Form.Label>Categories *</Form.Label>

        <Form.Control
          {...register('categories', {
            required: 'Enter at least one category.',
            validate: value =>
              value.split(',').some(item => item.trim()) ||
              'Enter at least one category.',
          })}
          isInvalid={!!errors.categories}
          placeholder="shounen, seinen"
        />

        <Form.Control.Feedback type="invalid">
          {errors.categories?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* SHORT DESCRIPTION */}
      <Form.Group className="mb-3">
        <Form.Label>Short description *</Form.Label>

        <Form.Control
          as="textarea"
          rows={4}
          {...register('description_short', {
            required: 'Description is required.',
            minLength: {
              value: 10,
              message: 'Description must have at least 10 characters.',
            },
          })}
          isInvalid={!!errors.description_short}
        />

        <Form.Control.Feedback type="invalid">
          {errors.description_short?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* FORM ACTIONS */}
      <Row className="mt-4">
        <Col className="d-flex gap-3">
          <Button to="/">Back to home</Button>
        </Col>

        <Col className="text-end">
          <Button type="submit" active={!isSaving}>
            {isSaving ? 'Saving...' : submitText}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AnimeForm;