import styles from './AnimeCard.module.scss';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types'
import noImage from '../../../assets/no-image.png'
import { useNavigate } from "react-router-dom";

const AnimeCard = ({ anime }) => {
  const navigate = useNavigate();

  const handleAnimePage = e => {
    e.preventDefault();
    navigate('/anime/' + anime.slug);
  }

  return (
    <Col xs='12' sm='6' md='4' lg='3' className='mb-4'>
      <div className={styles.card}>
        <div ><p>Slug: {anime.slug}</p></div>
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
        <button className={styles.btn} action={handleAnimePage}>More info</button>
      </div>
    </Col>
  );
};

AnimeCard.propTypes = {
	anime: PropTypes.object.isRequired,
}

export default AnimeCard;