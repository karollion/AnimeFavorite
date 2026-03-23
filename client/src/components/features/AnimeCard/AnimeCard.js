import styles from './AnimeCard.module.scss'
import { Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import noImage from '../../../assets/no-image.png'

const AnimeCard = ({ anime }) => {
  return (
    <Col xs="12" sm="6" md="3" lg="2" className="mb-4">
      <div
        className={styles.card}
        style={{
          backgroundImage: `url(${anime.anime_cover || noImage})`,
        }}
      >
        <div className={styles.top}>
          <p>{anime.age_rating}+</p>
          <p>{anime.type}</p>
          <p>{anime.rating_avg}</p>
        </div>

        <div className={styles.body}>
          
        </div>

        <Link to={`/anime/${anime.slug}`} className={styles.btn}>
          {anime.title}
        </Link>
      </div>
    </Col>
  )
}

AnimeCard.propTypes = {
  anime: PropTypes.object.isRequired,
}

export default AnimeCard