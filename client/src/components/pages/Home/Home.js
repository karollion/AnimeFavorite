import styles from './Home.module.scss';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHome } from "../../../redux/reducers/homeSliceRedux";

import RandomAnime from '../../features/RandomAnime/RandomAnime';
import AnimeSection from '../../features/AnimeSection/AnimeSection';

const Home = () => { 
  const dispatch = useDispatch();

  const {
    newAnimes,
    topRated,
    animeFilms,
    animeTV,
    randomAnime,
    loading,
  } = useSelector(state => state.home);

    /* ================= LOAD HOME ================= */

  useEffect(() => {
    dispatch(fetchHome());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.root}>
      <h2>Home</h2>
        <RandomAnime anime={randomAnime} />
        <AnimeSection title="New Animes" animes={newAnimes} />
        <AnimeSection title="Top Rated" animes={topRated} />
        <AnimeSection title="Movies" animes={animeFilms} />
        <AnimeSection title="TV series" animes={animeTV} />
    </div>
  );
};

export default Home;