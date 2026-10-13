import styles from './AnimeForm.module.scss';
import { useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Button from '../../common/Button/Button';
import { useForm } from 'react-hook-form';

const AnimeForm = ({
  anime = null,
  onSubmit,
  submitText = 'Save',
  isSaving = false,
}) => {
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

    const cover = data.anime_cover?.[0] || null;

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)} className={styles.root}>

      {/* TITLE */}
      <Form.Group className="mb-3">
        <Form.Label>Title *</Form.Label>
        <Form.Control
          {...register('title', { required: true, minLength: 5, maxLength: 70 })}
          placeholder="Enter title"
        />
        {errors.title && <small className="text-danger">Title is required (5–70)</small>}
      </Form.Group>

      {/* ORIGINAL TITLE */}
      <Form.Group className="mb-3">
        <Form.Label>Original title</Form.Label>
        <Form.Control
          {...register('original_title', { minLength: 2, maxLength: 70 })}
          placeholder="Original title"
        />
      </Form.Group>

      {/* AGE RATING */}
      <Form.Group className="mb-3">
        <Form.Label>Age rating *</Form.Label>
        <Form.Control
          type="number"
          {...register('age_rating', {
            required: true,
            min: 0,
            max: 21,
            valueAsNumber: true,
          })}
        />
        {errors.age_rating && <small className="text-danger">0 – 21 only</small>}
      </Form.Group>

      {/* TYPE */}
      <Form.Group className="mb-3">
        <Form.Label>Type *</Form.Label>
        <Form.Select {...register('type', { required: true })}>
          <option value="">-- choose --</option>
          <option value="TV">TV</option>
          <option value="Movie">Movie</option>
          <option value="OVA">OVA</option>
          <option value="ONA">ONA</option>
        </Form.Select>
        {errors.type && <small className="text-danger">Type is required</small>}
      </Form.Group>

      {/* WORLD */}
      <Form.Group className="mb-3">
        <Form.Label>World</Form.Label>
        <Form.Control {...register('world', { maxLength: 30 })} />
      </Form.Group>

      {/* GENRES */}
      <Form.Group className="mb-3">
        <Form.Label>Genres *</Form.Label>
        <Form.Control
          {...register('genres', { required: true })}
          placeholder="action, fantasy, drama"
        />
      </Form.Group>

      {/* CATEGORIES */}
      <Form.Group className="mb-3">
        <Form.Label>Categories *</Form.Label>
        <Form.Control
          {...register('categories', { required: true })}
          placeholder="shounen, seinen"
        />
      </Form.Group>

      {/* DESCRIPTION */}
      <Form.Group className="mb-3">
        <Form.Label>Short description *</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          {...register('description_short', { required: true, minLength: 10 })}
        />
      </Form.Group>

      {/* COVER */}
      <Form.Group className="mb-4">
        <Form.Label>
          Anime cover {anime ? '(optional)' : '*'}
        </Form.Label>
                
        <Form.Control
          type="file"
          accept="image/jpeg,image/png,image/webp"
          {...register('anime_cover', {
            validate: files => {
              if (!files?.length) return true;
            
              const file = files[0];
            
              if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                return 'Choose a JPG, PNG or WebP image.';
              }
            
              if (file.size > 5 * 1024 * 1024) {
                return 'The image must not exceed 5 MB.';
              }
            
              return true;
            },
          })}
        />
      </Form.Group>

      {/* ACTIONS */}
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