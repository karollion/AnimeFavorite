import styles from './Home.module.scss';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHome } from "../../../redux/reducers/homeSliceRedux";

import RandomAnime from '../../features/RandomAnime/RandomAnime';
import AnimeSection from '../../features/AnimeSection/AnimeSection';

const Home = () => { 
  const dispatch = useDispatch();

  const {
    newest,
    topRated,
    films,
    tvSeries,
    random,
    loading,
  } = useSelector(state => state.home);

    /* ================= LOAD HOME ================= */

  useEffect(() => {
    dispatch(fetchHome());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.root}>
      <div>
        <AnimeSection title="New Animes" animes={newest} />
        <AnimeSection title="Top Rated" animes={topRated} />
        <AnimeSection title="Movies" animes={films} />
        <AnimeSection title="TV series" animes={tvSeries} />
      </div>
      <div>
        <RandomAnime anime={random} />
      </div>
    </div>
  );
};

export default Home;