import styles from './LoginForm.module.scss';
import { Form, Row, Col } from 'react-bootstrap';
import Button from '../../common/Button/Button';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { loginRequest } from '../../../redux/reducers/userRedux';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ actionText = 'Login' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = data => {
    dispatch(loginRequest(data));
    navigate('/')
  };


  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.root}>

      {/* LOGIN */}
      <Form.Group className="mb-3">
        <Form.Label>Login</Form.Label>
        <Form.Control
          {...register('login', { required: true, minLength: 3, maxLength: 50 })}
          placeholder="Enter login"
        />
        {errors.login && <small className="text-danger">Login is required (3–50 chars)</small>}
      </Form.Group>

      {/* PASSWORD */}
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          {...register('password', { minLength: 3, maxLength: 50 })}
          placeholder="*****"
        />
        {errors.password && <small className="text-danger">Password is required</small>}
      </Form.Group>

      {/* ACTIONS */}
      <Row className="mt-4">
        <Col className="d-flex gap-3">
          <Button to="/">Back to home</Button>
        </Col>

        <Col className="text-end">
          <Button type="submit">{actionText}</Button>
        </Col>
      </Row>

    </Form>
  );
};

export default LoginForm;