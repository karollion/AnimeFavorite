import styles from './AnimeCard.module.scss'
import { Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import noImage from '../../../assets/no-image.png'

const AnimeCard = ({ anime }) => {
  return (
    <Col xs="12" sm="6" md="4" lg="3" className="mb-4">
      <div className={styles.card}>
        <div><p>Slug: {anime.slug}</p></div>
        <div><p>Age rating: {anime.age_rating}</p></div>
        <div><p>Rating: {anime.rating_overall}</p></div>

        <img
          alt={anime.title}
          src={anime.anime_cover || noImage}
          className={styles.img}
        />

        <div className={styles.body}>
          <p>{anime.title}</p>
          <p>{anime.type}</p>
        </div>
        <Link
          to={`/anime/slug/${anime.slug}`}
          className={styles.btn}
        >
          More info
        </Link>
      </div>
    </Col>
  )
}

AnimeCard.propTypes = {
  anime: PropTypes.object.isRequired,
}

export default AnimeCard