import styles from './Home.module.scss';
import NewAnimes from '../../features/NewAnimes/NewAnimes';
import AnimeFilms from '../../features/AnimeFilms/AnimeFilms';
import AnimeTV from '../../features/AnimeTV/AnimeTV';

const Home = () => { 

  return (
    <div className={styles.root}>
      <h2>Home</h2>
        <NewAnimes />
        <AnimeFilms />
        <AnimeTV />
    </div>
  );
};

export default Home;