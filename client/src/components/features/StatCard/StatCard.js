import styles from './StatCard.module.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import noImage from '../../../assets/no-image.png';

const StatCard = ({ anime }) => {
  return (
    <div>
      <div className={styles.card}>
        <img
          src={anime?.anime_cover || noImage}
          alt={anime.title}
          className={styles.img}
        />
        
        <div className={styles.title}>
          <Link to={`/anime/${anime.slug}`} className={styles.btn}>
            {anime.title}
          </Link>
        </div>

        <div className={styles.info}>
          <p>{anime.age_rating}+</p>
          <p>{anime.type}</p>
          <p>{anime.rating_avg}</p>
        </div>

      </div>
    </div>
  )
};

StatCard.propTypes = {
  anime: PropTypes.object.isRequired,
};

export default StatCard;