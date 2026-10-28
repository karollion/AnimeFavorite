import styles from './LoginForm.module.scss';
import { Form } from 'react-bootstrap';
import Button from '../../common/Button/Button';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { loginRequest } from '../../../redux/reducers/userRedux';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../../../context/MessageContext';

const LoginForm = ({ actionText = 'Login' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showMessage } = useMessage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = async (data) => {
    try {
      await dispatch(loginRequest(data));
      navigate('/');
    } catch (error) {
      await showMessage({
        title: 'Login failed',
        message:
          error.response?.status === 401
            ? 'Invalid login or password.'
            : 'An error occurred during login. Please try again.',
        mode: 'alert',
        confirmText: 'OK',
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

        <p>Don't have an account?</p>
        <Button to="/Signup">Signup</Button>
        <Button to="/">Home</Button>
      </div>

    </Form>
  );
};

export default LoginForm;