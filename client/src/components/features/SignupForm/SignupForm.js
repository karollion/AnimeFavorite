import styles from './SignupForm.module.scss';
import { Form } from 'react-bootstrap';
import Button from '../../common/Button/Button';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerRequest } from '../../../redux/reducers/userRedux';

const SignupForm = ({ actionText = 'Signup' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({});

  const onSubmit = async data => {
    try {
      await dispatch(registerRequest({
        login: data.login,
        password: data.password,
        email: data.email,
        birth_year: Number(data.birth_year),
      }));

      navigate('/Login');
    } catch (err) {
      // tutaj komunikat
    }
  };


  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={styles.root}>

      {/* E-MAIL */}
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          {...register('email', {
            required: true,
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Invalid email address',
            },
          })}
          placeholder="Enter email"
        />
        {errors.email && (
          <small className="text-danger">
            {errors.email.message || 'Email is required'}
          </small>
        )}
      </Form.Group>

      {/* LOGIN */}
      <Form.Group className="mb-3">
        <Form.Label>Login</Form.Label>
        <Form.Control
          {...register('login', { required: true, minLength: 3, maxLength: 30 })}
          placeholder="Enter login"
        />
        {errors.login?.type === 'required' && (
          <small className="text-danger">Login is required</small>
        )}

        {errors.login?.type === 'minLength' && (
          <small className="text-danger">
            Login must contain at least 3 characters
          </small>
        )}

        {errors.login?.type === 'maxLength' && (
          <small className="text-danger">
            Login cannot exceed 30 characters
          </small>
        )}
      </Form.Group>

      {/* PASSWORD */}
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          {...register('password', {
            required: true,
            minLength: 7,
            maxLength: 30,
          })}
          placeholder="Enter password"
        />
        {errors.password && <small className="text-danger">Password is required</small>}
        <p>(Between 7 and 30 characters)</p>
      </Form.Group>

      {/* CONFIRM PASSWORD */}
      <Form.Group className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          {...register('confirmPassword', {
            required: true,
            validate: value =>
              value === watch('password') || 'Passwords do not match',
          })}
          placeholder="Enter password"
        />
        {errors.confirmPassword?.type === 'required' && (
          <small className="text-danger">Password confirmation is required</small>
        )}

        {errors.confirmPassword?.type === 'validate' && (
          <small className="text-danger">
            {errors.confirmPassword.message}
          </small>
        )}
        <p>(Between 7 and 30 characters)</p>
      </Form.Group>

      {/* BIRTH YEAR */}
      <Form.Group className="mb-3">
        <Form.Label>Birth year</Form.Label>
        <Form.Select
          {...register('birth_year', { required: true })}
        >
          <option value="">Select birth year</option>

          {Array.from(
            { length: new Date().getFullYear() - 1900 + 1 },
            (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            }
          )}
        </Form.Select>
        
        {errors.birth_year && (
          <small className="text-danger">Birth year is required</small>
        )}
      </Form.Group>

      {/* ACTIONS */}
      <div className={styles.buttons}>
          <Button type="submit">{actionText}</Button>
          <p>Already have an account?</p>
          <Button to="/Login">Login</Button>
          <Button to="/">Home</Button>
      </div>
    </Form>
  );
  
};

export default SignupForm;