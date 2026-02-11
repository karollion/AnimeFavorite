import styles from './Anime.module.scss'
import { getAnimeBySlug } from '../../../redux/reducers/animesRedux'
import { useParams, Navigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Col } from 'react-bootstrap'
import noImage from '../../../assets/no-image.png'

const Anime = () => {
  const { slug } = useParams()
  const anime = useSelector(state => getAnimeBySlug(state, slug))

  if (!anime) {
    return <Navigate to="/" />
  }

  return (
    <div className={styles.root}>
      <h1>{anime.title}</h1>

      <div>
        <p>Slug: {anime.slug}</p>
        <p>Age rating: {anime.age_rating}</p>
        <p>Rating: {anime.rating_overall}</p>

        <img
          alt={anime.title}
          src={anime.anime_cover || noImage}
          className={styles.img}
        />

        <div className={styles.body}>
          <p>{anime.type}</p>
        </div>
      </div>

      <Col xs="12" className="d-flex justify-content-center my-3">
        <Link to="/" className={styles.btn}>
          Back to home
        </Link>
      </Col>
    </div>
  )
}

export default Anime