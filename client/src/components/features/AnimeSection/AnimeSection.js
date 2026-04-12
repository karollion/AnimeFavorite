import styles from './AnimeSection.module.scss'
import { Row } from 'react-bootstrap'
import AnimeCard from '../AnimeCard/AnimeCard'
import PropTypes from 'prop-types'
import Button from '../../common/Button/Button'
import SkeletonAnimeCard from '../AnimeCard/SkeletonAnimeCard'

const AnimeSection = ({ title, animes }) => {
  if (!animes?.length) {
    return (
      <div className={styles.root}>
        <h2>{title}</h2>
        <Row>
          {[...Array(10)].map((_, i) => (
            <SkeletonAnimeCard key={i} />
          ))}
        </Row>
        <Button to="/">Show more</Button>
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
      <Button to="/">Show more</Button>
    </div>
  )
}

AnimeSection.propTypes = {
  title: PropTypes.string.isRequired,
  animes: PropTypes.array.isRequired,
}

export default AnimeSection;