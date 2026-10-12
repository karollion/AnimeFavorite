import styles from './EditAnime.module.scss';
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AnimeForm from '../../features/AnimeForm/AnimeForm';
import Container from '../../common/container/Container';
import {
  fetchAnimeBySlug,
  getSelectedAnime,
  getAnimesLoading, 
  getAnimesError
} from '../../../redux/reducers/animesRedux'

const EditAnime = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const loading = useSelector(getAnimesLoading)
  const anime = useSelector(getSelectedAnime)
  const error = useSelector(getAnimesError)
  
  useEffect(() => {
    if (!slug) return
    dispatch(fetchAnimeBySlug(slug))
  }, [dispatch, slug])
  
  if (loading || !anime) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className={styles.root}>
      <Container>
        <h1>Edit anime</h1>
        <h3>{anime.title}</h3>
        <AnimeForm anime={anime}/>
      </Container>
    </div>
  )
}

export default EditAnime;