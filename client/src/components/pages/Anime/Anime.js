import styles from './Anime.module.scss'
import { useParams, Navigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAnimeBySlug,
  getSelectedAnime,
  getAnimesLoading
} from '../../../redux/reducers/animesRedux'
import noImage from '../../../assets/no-image.png'

const Anime = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()

  const loading = useSelector(getAnimesLoading)
  
  const anime = useSelector(getSelectedAnime)
  console.log(anime)

  useEffect(() => {
    if (!slug) return
    dispatch(fetchAnimeBySlug(slug))
  }, [dispatch, slug])
  if (loading || !anime) return <p>Loading...</p>

  return (
    <div className={styles.root}>
      <h1>{anime.title}</h1>

      <img
        src={anime.anime_cover || noImage}
        alt={anime.title}
        className={styles.img}
      />

      <p>Age rating: {anime.age_rating}</p>
      <p>Rating: {anime.rating_avg}</p>

      <div className={styles.characters}>
        {anime.characters?.map(c => (
          <div key={c._id} className={styles.characterCard}>
            <img src={c.image || noImage} alt={c.firstName} />
            <p>{c.firstName}</p>
          </div>
        ))}
      </div>

      <p>Seasons:</p>
      <ul>
        {anime.seasons?.map(season => (
          <li key={season._id}>
            {season.title}
          </li>
        ))}
      </ul>

      <p>Reviews:</p>
      <ul>
        {anime.reviews?.map(review => (
          <li key={review._id}>
            {review.user.login + ": "}
            {review.review_text}
          </li>
        ))}
      </ul>

      <Link to="/" className={styles.btn}>
        Back to home
      </Link>
    </div>
  )
}

export default Anime