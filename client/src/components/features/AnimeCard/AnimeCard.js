import styles from './AnimeCard.module.scss';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import noImage from '../../../assets/no-image.png';
import frame from '../../../assets/frame.png';

// okładka anime narazie do testów ramka
// anime.anime_cover
const AnimeCard = ({ anime }) => {
  return (
    <Col xs="12" sm="6" md="4" lg="3" className="mb-4">
      <div className={styles.card}>
        
        <img
          src={anime.anime_cover || noImage}
          alt={anime.title}
          className={styles.img}
        />
      
        <img
          src={frame}
          alt=""
          className={styles.frame}
        />

        <div className={styles.infoPanel}>
          <div className={styles.top}>
            <p>{anime.age_rating}+</p>
            <p>{anime.type}</p>
            <p>{anime.rating_avg}</p>
          </div>

          <div className={styles.bottom}>
            <Link to={`/anime/${anime.slug}`} className={styles.btn}>
              {anime.title}
            </Link>
          </div>
        </div>
        
      </div>
    </Col>
  )
}

AnimeCard.propTypes = {
  anime: PropTypes.object.isRequired,
};

export default AnimeCard;