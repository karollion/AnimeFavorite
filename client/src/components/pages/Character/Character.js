import styles from './Character.module.scss'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
//import {
//  fetchcharacterBySlug,
//  getSelectedcharacter,
//  getcharactersLoading, 
//  getcharactersError
//} from '../../../redux/reducers/charactersRedux'
import noImage from '../../../assets/no-image.png'
import CharacterCard from '../../features/CharacterCard/CharacterCard'
import SeasonCard from '../../features/SeasonCard/SeasonCard'
import ReviewCard from '../../features/ReviewCard/ReviewCard'
import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'

const Character = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()

  /** 
  const loading = useSelector(getcharactersLoading)
  const character = useSelector(getSelectedcharacter)
  const error = useSelector(getcharactersError)

  useEffect(() => {
    if (!slug) return
    dispatch(fetchcharacterBySlug(slug))
  }, [dispatch, slug])
  
  if (loading || !character) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className={styles.root}>
      <Container>
        <h1>{character.anime.title}</h1>

        <img
          src={character.photo || noImage}
          alt={character.firstName}
          className={styles.img}
        />

        <p>First Name:  {character.firstName}</p>
        <p>Last Name: {character.lastName}</p>
        <p>Gender: {character.gender}</p>
        <p>Role: {character.role}</p>
        <p>Species: {character.species}</p>
        <p>Age: {character.age}</p>
        <p>OriginWorld: {character.originWorld}</p>
        <p>Description: {character.description}</p>

        <Button to="/">Back to home</Button>
      </Container>
    </div>
  )
  
  */

  return (
    <div className={styles.root}>
      <Container>
        <h1>character</h1>
        <Button to="/">Back to home</Button>
      </Container>
    </div>
  )
}

export default Character;