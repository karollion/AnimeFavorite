import styles from './Anime.module.scss'
import { useParams, Navigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAnimeBySlug,
  getAnimeBySlug,
  getAnimesLoading
} from '../../../redux/reducers/animesRedux'
import noImage from '../../../assets/no-image.png'

const Anime = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()

  const loading = useSelector(getAnimesLoading)
  
  const anime = useSelector(state => getAnimeBySlug(state, slug) )
  
  console.log(anime)
  useEffect(() => {
    if (!slug || anime) return
  
    dispatch(fetchAnimeBySlug(slug))
  }, [dispatch, slug, anime])

  if (loading) return <p>Loading...</p>
  if (!anime) return <Navigate to="/" />

  return (
    <div className={styles.root}>
      <h1>{anime.title}</h1>

      <img
        src={anime.anime_cover || noImage}
        alt={anime.title}
        className={styles.img}
      />

      <p>Age rating: {anime.age_rating}</p>
      <p>Rating: {anime.rating_overall}</p>

      

      <Link to="/" className={styles.btn}>
        Back to home
      </Link>
    </div>
  )
}

export default Anime