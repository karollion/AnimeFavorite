import styles from './RandomAnime.module.scss'
import AnimeCard from '../AnimeCard/AnimeCard'
import PropTypes from 'prop-types'

const RandomAnime = ({ anime }) => {
  if (!anime) {
    return (
      <div className={styles.root}>
        <h3>Random Anime</h3>
        <p>No anime</p>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <h3>Random Anime</h3>
      <AnimeCard key={anime._id} anime={anime} />
    </div>
  )
}

RandomAnime.propTypes = {
  anime: PropTypes.object.isRequired,
}

export default RandomAnime;