import styles from './LoginForm.module.scss';
import { Form } from 'react-bootstrap';
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
    setError,
    formState: { errors },
  } = useForm({});

  const onSubmit = async data => {
    try {
      await dispatch(loginRequest(data));
      navigate('/');
    } catch (error) {
    setError('root.serverError', {
      type: 'server',
      message:
        error.response?.status === 401
          ? 'Invalid login or password.'
          : 'An error occurred during login. Please try again.',
    });
  }
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
          type="password"
          {...register('password', { minLength: 3, maxLength: 50 })}
          placeholder="*****"
        />
        {errors.password && <small className="text-danger">Password is required</small>}
      </Form.Group>

      {/* ACTIONS */}
      <div className={styles.buttons}>
        <Button type="submit">{actionText}</Button>

        {errors.root?.serverError && (
          <p className="text-danger" role="alert">
            {errors.root.serverError.message}
          </p>
        )}

        <p>Don't have an account?</p>
        <Button to="/Signup">Signup</Button>
        <Button to="/">Home</Button>
      </div>

    </Form>
  );
};

export default LoginForm;