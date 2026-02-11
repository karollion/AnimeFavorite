import styles from './Anime.module.scss'
//import { getAnimeBySlug } from "../../../redux/reducers/animesRedux";
import { useNavigate, Navigate } from "react-router-dom";
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';

const Ad = () => {
  const navigate = useNavigate();

  const  {slug}  = useParams();
  //const anime = useSelector(getAnimeBySlug(slug));

  const handleBack = e => {
    e.preventDefault();
    navigate('/');
  }
  
  if (!anime) return <Navigate to="/" />;
  return (
    <div className={styles.root}>
      <div>
        <h1>Anime Page {}</h1>
        <div>
          <div >
            <p>Slug: {anime.slug}</p></div>
            <div ><p>Age rating: {anime.age_rating}</p></div>
            <div ><p>Rating: {anime.rating_overall}</p></div>
            <img
              variant='top'
              alt={anime.title}
              src={anime.anime_cover || noImage}
              className={styles.img}
            />
            <div className={styles.body}>
              <p>{anime.title}</p>
              <p> {anime.type}</p>
          </div>
        </div>
        <Col xs='12' className='d-flex justify-content-center my-3'>
            <button className={styles.btn} action={handleBack}>Back to home</button>
        </Col>
      </div>
    </div>
  );
};

export default Ad;