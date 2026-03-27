import styles from './Anime.module.scss'
import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAnimeBySlug,
  getSelectedAnime,
  getAnimesLoading
} from '../../../redux/reducers/animesRedux'
import noImage from '../../../assets/no-image.png'
import CharacterCard from '../../features/CharacterCard/CharacterCard'
import SeasonCard from '../../features/SeasonCard/SeasonCard'
import ReviewCard from '../../features/ReviewCard/ReviewCard'

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

      <p>Title:  {anime.title}</p>
      <p>Original title: {anime.original_title}</p>
      <p>Age rating: {anime.age_rating}</p>
      <p>Type: {anime.type}</p>
      <p>World: {anime.world}</p>
      <p>Genres: {anime.genres}</p>
      <p>Categories: {anime.categories}</p>
      <p>Rating avg: {anime.rating_avg}</p>
      <p>Rating count: {anime.rating_count}</p>
      <p>Description: {anime.description_short}</p>

      <p>Characters:</p>
      <div className={styles.characters}>
        {anime.characters?.map(c => (
          <div key={c._id} >
            <CharacterCard character={c} />
          </div>
        ))}
      </div>

      <p>Seasons:</p>
      <div>
        {anime.seasons?.map(season => (
          <div key={season._id}>
            <SeasonCard season={season} />
          </div>
        ))}
      </div>

      <p>Reviews:</p>
      <ul>
        {anime.reviews?.map(review => (
          <li key={review._id}>
            <ReviewCard review={review} />
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