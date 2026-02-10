import styles from './Home.module.scss';
import NewAnimes from '../../features/NewAnimes/NewAnimes';


const Home = () => { 

  return (
    <div className={styles.root}>
      <h2>Home</h2>
        <NewAnimes />
    </div>
  );
};

export default Home;