import styles from './AdForm.module.scss';
import { Col, Form, Row } from "react-bootstrap";
import Button from "../../common/Button/Button";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useParams } from 'react-router';
import { useNavigate } from "react-router-dom";

const AnimeForm = ({ action, actionText, ...props }) => {
  const navigate = useNavigate();
  const { slug } = useParams()

  const [title, setTitle] = useState(props.title || '');
  const [original_title, setOriginal_title] = useState(props.title || '');
  const [age_rating, setAge_rating] = useState(props.age_rating || '');
  const [type, setType] = useState(props.type || '');
  const [world, setWorld] = useState(props.world || '');
  const [genres, setGenres] = useState(props.genres || '');
  const [categories, setCategories] = useState(props.categories || '');
  const [description_short, setDescription_short] = useState(props.description_short || '');
  const [anime_cover, setAnime_cover] = useState(props.anime_cover || '');

  const { register, handleSubmit: validate, formState: { errors } } = useForm();

  const handleSubmit = () => {
    if(content ) {
      action({ title, original_title });
    }
  };

  const handleBack = e => {
    e.preventDefault();
    navigate("/animes/slug/" + slug);
  }
  
  return (
    <Form onSubmit={validate(handleSubmit)} className={styles.root}>
      <Form.Group  controlId="form_title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          {...register("title", { required: true, minLength: 5, maxLength: 70 })}
          value={title}
          onChange={e => setTitle(e.target.value)}
          type='text' placeholder='Enter title (5 to 70 characters)'
        />
        {errors.title && <small className="d-block form-text text-danger mt-2">Title length is incorrect (min is 5, max is 70)</small>}
      </Form.Group>

      <Form.Group  controlId="formt_original_itle">
        <Form.Label>Original Title</Form.Label>
        <Form.Control
          {...register("original_title", { required: true, minLength: 5, maxLength: 70 })}
          value={original_title}
          onChange={e => setOriginal_title(e.target.value)}
          type='text' placeholder='Enter original_title (5 to 70 characters)'
        />
        {errors.original_title && <small className="d-block form-text text-danger mt-2">Original Title length is incorrect (min is 5, max is 70)</small>}
      </Form.Group>

      <Form.Group  controlId="form_age_rating">
        <Form.Label>Age Rating</Form.Label>
        <Form.Control
          {...register("age_rating", { required: true, min: 0, max: 21 })}
          value={age_rating}
          onChange={e => setAge_rating(e.target.value)}
          type='text' placeholder='Enter age rating'
        />
        {errors.age_rating && <small className="d-block form-text text-danger mt-2">Age Rating is incorrect (min is 0, max is 21)</small>}
      </Form.Group>

      <Form.Group controlId="form_Type">
        <Form.Label>Type</Form.Label>
        <Form.Select
          {...register("type", { required: true })}
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="">-- Choose Type --</option>
          <option value="TV">TV</option>
          <option value="Movie">Movie</option>
          <option value="OVA">OVA</option>
          <option value="ONA">ONA</option>
        </Form.Select>

        {errors.type && (
          <small className="d-block form-text text-danger mt-2">
            Type can't be empty
          </small>
        )}
      </Form.Group>










      <Form.Group  controlId="formContent">
        <Form.Label>Content</Form.Label>
        <Form.Control 
          {...register("content", { required: true, minLength: 20, maxLength: 1000 })}
          as="textarea" placeholder="Enter content (20 to 1000 characters)" rows={3} 
          value={content} 
          onChange={e => setContent(e.target.value)} />
          {errors.content && <small className="d-block form-text text-danger mt-2">Content length is incorrect (min is 20, max is 1000)</small>}
      </Form.Group>

      <Form.Group  controlId="formpicture">
        <Form.Label>Picture</Form.Label>
        <Form.Control
          {...register("picture", { required: false })}
          
          onChange={e => setPicture(e.target.files[0])}
          type='file'
        />
        {errors.picture && <small className="d-block form-text text-danger mt-2">Picture can't be empty</small>}
      </Form.Group>



      <Form.Group  controlId="formlocation">
        <Form.Label>Location</Form.Label>
        <Form.Control
          {...register("location", { required: true })}
          value={location}
          onChange={e => setLocation(e.target.value)}
          type='text' placeholder='Enter location'
        />
        {errors.location && <small className="d-block form-text text-danger mt-2">Location can't be empty</small>}
      </Form.Group>

      <Form.Group controlId="formLocation">
        <Form.Label>Location</Form.Label>
        <Form.Select
          {...register("location", { required: true })}
          value={location}
          onChange={e => setLocation(e.target.value)}
        >
          <option value="">-- choose location --</option>
          <option value="warehouse">Warehouse</option>
          <option value="office">Office</option>
          <option value="production">Production</option>
        </Form.Select>

        {errors.location && (
          <small className="d-block form-text text-danger mt-2">
            Location can't be empty
          </small>
        )}
      </Form.Group>

      <Row className="d-flex justify-content-center mt-3">
        {slug ? <Col  xs='12' md='6' className='d-flex justify-content-center'>
          <Button action={handleBack}>Back</Button>
          
        </Col> : null}
        <Col>
          <Link to="/" className={styles.btn}>
            Back to home
          </Link>
        </Col>
        <Col   xs='12' md='6' className='d-flex justify-content-center'>
          <Button  type="submit">{actionText}</Button>
        </Col>

      </Row>
      
    </Form>
  );
};

export default AnimeForm;