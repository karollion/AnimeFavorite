import styles from './AnimeFilms.module.scss'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Spinner } from 'react-bootstrap'
import {
  getAllAnimes,
  getAnimesLoading,
  getAnimesError,
  fetchAnimes
} from '../../../redux/reducers/animesRedux'
import AnimeCard from '../AnimeCard/AnimeCard'

const AnimeFilms = () => {
  const dispatch = useDispatch()

  const animes = useSelector(getAllAnimes)
  const isLoading = useSelector(getAnimesLoading)
  const error = useSelector(getAnimesError)

  useEffect(() => {
    dispatch(fetchAnimes())
  }, [dispatch])

  return (
    <div className={styles.root}>
      <h2>Anime Films</h2>

      {isLoading && <Spinner animation='border' variant='primary' />}

      {!isLoading && error && <p>Error: {error}</p>}

      {!isLoading && !error && animes.length === 0 && (
        <p>No animes</p>
      )}

      {!isLoading && !error && (
        <Row className='py-4'>
          {animes.map(anime => (
            <AnimeCard key={anime._id} anime={anime} />
          ))}
        </Row>
      )}
    </div>
  )
}

export default AnimeFilms;