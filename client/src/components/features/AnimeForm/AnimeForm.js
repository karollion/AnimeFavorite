
/* =====================================================
   ANIME FORM
   ===================================================== */

/**
 * @file AnimeForm.js
 * @description Reusable form for creating and editing anime information.
 *              Cover uploads are handled separately by AnimeCoverUpload.
 */

import styles from './AnimeForm.module.scss'

import { useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import Button from '../../common/Button/Button'

/* =====================================================
   ANIME FORM COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders the anime information form.
 *
 * @param {Object} props
 * @param {Object|null} props.anime - Anime data used to populate edit fields.
 * @param {Function} props.onSubmit - Callback receiving the anime payload.
 * @param {string} props.submitText - Optional submit button label.
 * @param {boolean} props.isSaving - Indicates whether the form is saving.
 *
 * @returns {JSX.Element}
 */
const AnimeForm = ({
  anime = null,
  onSubmit,
  submitText,
  isSaving = false,
}) => {
  const { t } = useTranslation()

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
  })

  /* =====================================================
     FORM DATA SYNCHRONIZATION
     ===================================================== */

  /**
   * Populates the form when an existing anime is loaded.
   * Resets to empty values when creating a new anime.
   */
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
    })
  }, [anime, reset])

  /* =====================================================
     FORM SUBMISSION
     ===================================================== */

  /**
   * Converts form values into the payload expected by the API.
   * Genres and categories are converted into arrays.
   * No image file is included in this request.
   *
   * @param {Object} data - Validated form data.
   */
  const handleFormSubmit = async (data) => {
    if (typeof onSubmit !== 'function') {
      console.error('AnimeForm requires an onSubmit function.')
      return
    }

    const payload = {
      ...data,
      age_rating: Number(data.age_rating),
      genres: data.genres
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      categories: data.categories
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    }

    await onSubmit(payload)
  }

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
        <Form.Label>{t('animeForm.title')} *</Form.Label>

        <Form.Control
          {...register('title', {
            required: t('animeForm.validation.titleRequired'),
            minLength: {
              value: 5,
              message: t('animeForm.validation.titleMinLength'),
            },
            maxLength: {
              value: 70,
              message: t('animeForm.validation.titleMaxLength'),
            },
          })}
          isInvalid={!!errors.title}
          placeholder={t('animeForm.placeholders.title')}
        />

        <Form.Control.Feedback type="invalid">
          {errors.title?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* ORIGINAL TITLE */}
      <Form.Group className="mb-3">
        <Form.Label>{t('animeForm.originalTitle')}</Form.Label>

        <Form.Control
          {...register('original_title', {
            minLength: {
              value: 2,
              message: t('animeForm.validation.originalTitleMinLength'),
            },
            maxLength: {
              value: 70,
              message: t('animeForm.validation.originalTitleMaxLength'),
            },
          })}
          isInvalid={!!errors.original_title}
          placeholder={t('animeForm.placeholders.originalTitle')}
        />

        <Form.Control.Feedback type="invalid">
          {errors.original_title?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* AGE RATING */}
      <Form.Group className="mb-3">
        <Form.Label>{t('animeForm.ageRating')} *</Form.Label>

        <Form.Control
          type="number"
          {...register('age_rating', {
            required: t('animeForm.validation.ageRatingRequired'),
            valueAsNumber: true,
            min: {
              value: 0,
              message: t('animeForm.validation.ageRatingMin'),
            },
            max: {
              value: 21,
              message: t('animeForm.validation.ageRatingMax'),
            },
            validate: (value) =>
              Number.isInteger(value) ||
              t('animeForm.validation.ageRatingInteger'),
          })}
          isInvalid={!!errors.age_rating}
        />

        <Form.Control.Feedback type="invalid">
          {errors.age_rating?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* TYPE */}
      <Form.Group className="mb-3">
        <Form.Label>{t('animeForm.type')} *</Form.Label>

        <Form.Select
          {...register('type', {
            required: t('animeForm.validation.typeRequired'),
          })}
          isInvalid={!!errors.type}
        >
          <option value="">
            {t('animeForm.typePlaceholder')}
          </option>
          <option value="TV">TV</option>
          <option value="Movie">{t('animeForm.types.movie')}</option>
          <option value="OVA">OVA</option>
          <option value="ONA">ONA</option>
        </Form.Select>

        <Form.Control.Feedback type="invalid">
          {errors.type?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* WORLD */}
      <Form.Group className="mb-3">
        <Form.Label>{t('animeForm.world')}</Form.Label>

        <Form.Control
          {...register('world', {
            maxLength: {
              value: 30,
              message: t('animeForm.validation.worldMaxLength'),
            },
          })}
          isInvalid={!!errors.world}
          placeholder={t('animeForm.placeholders.world')}
        />

        <Form.Control.Feedback type="invalid">
          {errors.world?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* GENRES */}
      <Form.Group className="mb-3">
        <Form.Label>{t('animeForm.genres')} *</Form.Label>

        <Form.Control
          {...register('genres', {
            required: t('animeForm.validation.genresRequired'),
            validate: (value) =>
              value.split(',').some((item) => item.trim()) ||
              t('animeForm.validation.genresRequired'),
          })}
          isInvalid={!!errors.genres}
          placeholder={t('animeForm.placeholders.genres')}
        />

        <Form.Control.Feedback type="invalid">
          {errors.genres?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* CATEGORIES */}
      <Form.Group className="mb-3">
        <Form.Label>{t('animeForm.categories')} *</Form.Label>

        <Form.Control
          {...register('categories', {
            required: t('animeForm.validation.categoriesRequired'),
            validate: (value) =>
              value.split(',').some((item) => item.trim()) ||
              t('animeForm.validation.categoriesRequired'),
          })}
          isInvalid={!!errors.categories}
          placeholder={t('animeForm.placeholders.categories')}
        />

        <Form.Control.Feedback type="invalid">
          {errors.categories?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* SHORT DESCRIPTION */}
      <Form.Group className="mb-3">
        <Form.Label>{t('animeForm.shortDescription')} *</Form.Label>

        <Form.Control
          as="textarea"
          rows={4}
          {...register('description_short', {
            required: t('animeForm.validation.descriptionRequired'),
            minLength: {
              value: 10,
              message: t('animeForm.validation.descriptionMinLength'),
            },
          })}
          isInvalid={!!errors.description_short}
          placeholder={t('animeForm.placeholders.description')}
        />

        <Form.Control.Feedback type="invalid">
          {errors.description_short?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* FORM ACTIONS */}
      <Row className="mt-4">
        <Col className="d-flex gap-3">
          <Button to="/">
            {t('animeForm.backToHome')}
          </Button>
        </Col>

        <Col className="text-end">
          <Button type="submit" active={!isSaving}>
            {isSaving
              ? t('animeForm.saving')
              : submitText || t('common.save')}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

/* =====================================================
   PROP TYPES
   ===================================================== */

AnimeForm.propTypes = {
  anime: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  isSaving: PropTypes.bool,
}

export default AnimeForm
