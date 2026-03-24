import styles from './AnimeSection.module.scss'
import { Row } from 'react-bootstrap'
import AnimeCard from '../AnimeCard/AnimeCard'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const AnimeSection = ({ title, animes }) => {
  if (!animes?.length) {
    return (
      <div className={styles.root}>
        <h2>{title}</h2>
        <p>No animes</p>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <h2>{title}</h2>
      <Row>
        {animes.map(a => (
          <AnimeCard key={a._id} anime={a} />
        ))}
      </Row>
      <Link to={`/`} className={styles.btn}>
        Show more
      </Link>
    </div>
  )
}

AnimeSection.propTypes = {
  title: PropTypes.string.isRequired,
  animes: PropTypes.array.isRequired,
}

export default AnimeSection;