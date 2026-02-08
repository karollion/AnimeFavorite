import styles from './AnimeCard.module.scss';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types'

const AnimeCard = ({ anime }) => {
  /*
  const navigate = useNavigate();

  const handleClick = e => {
    e.preventDefault();
    navigate("/anime/" + anime.slug);
  }

  <div className={styles.buttonBox}>
    <Button variant="primary" action={handleClick}>Read more</Button>
  </div>
  */

  return (
    <Col xs='12' sm='6' md='4' lg='3' className='mb-4'>
      <div className={styles.card}>
        <div className={styles.title}><p>{anime.age_rating}$</p></div>
        <div className={styles.title}><p>{anime.rating_overall}$</p></div>
        <img variant='top' alt='anime_image' src={anime.anime_cover} className={styles.img} />
			  <div className={styles.body}>
          <p>{anime.title}</p>
          <p> {anime.type}</p>
        </div>
      </div>
    </Col>
  );
};

AnimeCard.propTypes = {
	anime: PropTypes.object.isRequired,
}

export default AnimeCard;