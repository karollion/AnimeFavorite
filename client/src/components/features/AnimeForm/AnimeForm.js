import styles from './AnimeForm.module.scss';
import { Form, Row, Col } from 'react-bootstrap';
import Button from '../../common/Button/Button';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';

const AnimeForm = ({ action, actionText = 'Save', defaultValues = {} }) => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: defaultValues.title || '',
      original_title: defaultValues.original_title || '',
      age_rating: defaultValues.age_rating || 0,
      type: defaultValues.type || '',
      world: defaultValues.world || '',
      genres: defaultValues.genres?.join(', ') || '',
      categories: defaultValues.categories?.join(', ') || '',
      description_short: defaultValues.description_short || '',
      status: defaultValues.status || 'not watched',
    },
  });

  const onSubmit = data => {
    const payload = {
      ...data,
      age_rating: Number(data.age_rating),
      genres: data.genres.split(',').map(g => g.trim()),
      categories: data.categories.split(',').map(c => c.trim()),
    };

    if (data.anime_cover?.length) {
      payload.anime_cover = data.anime_cover[0];
    }

    action(payload);
  };

  const handleBack = e => {
    e.preventDefault();
    navigate(`/animes/${slug}`);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.root}>

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
        <Form.Label>Anime cover *</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          {...register('anime_cover', {
            validate: files =>
              !files?.length ||
              ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type),
          })}
        />
      </Form.Group>

      {/* ACTIONS */}
      <Row className="mt-4">
        <Col className="d-flex gap-3">
          {slug && <Button action={handleBack}>Back</Button>}
          <Link to="/">Home</Link>
        </Col>

        <Col className="text-end">
          <Button type="submit">{actionText}</Button>
        </Col>
      </Row>

    </Form>
  );
};

export default AnimeForm;