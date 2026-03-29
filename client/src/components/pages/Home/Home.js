import styles from './Home.module.scss';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHome } from "../../../redux/reducers/homeSliceRedux";

import AnimeSection from '../../features/AnimeSection/AnimeSection';
import Container from '../../common/container/Container';

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
      <Container>
        <div>
          <AnimeSection title="New Animes" animes={newest} />
          <AnimeSection title="Top Rated" animes={topRated} />
          <AnimeSection title="Random" animes={random} />
          <AnimeSection title="Movies" animes={films} />
          <AnimeSection title="TV series" animes={tvSeries} />
        </div>
      </Container>
    </div>
  );
};

export default Home;