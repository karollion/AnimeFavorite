import { useNavigate } from 'react-router-dom';
import styles from './WrongPage.module.scss'

const WrongPage = () => {
  const navigate = useNavigate();

  const handleBack = e => {
    e.preventDefault();
    navigate('/');
  }
  return (
    <div className={styles.root}>
      <h1>404</h1>
      <h4>Oh no!</h4>
      <button className={styles.btn} action={handleBack}>Back to home</button>

    </div>
  );
};

export default WrongPage;