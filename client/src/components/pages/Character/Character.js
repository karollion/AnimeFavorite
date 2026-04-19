import styles from './Character.module.scss'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import noImage from '../../../assets/no-image.png'
import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'
import { 
  fetchCharacterById,
  getCharactersError, 
  getCharactersLoading, 
  getSelectedCharacter 
} from '../../../redux/reducers/charactersRedux'

const Character = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const loading = useSelector(getCharactersLoading)
  const character = useSelector(getSelectedCharacter)
  const error = useSelector(getCharactersError)

  console.log("CHAR:", character);
  console.log("LOADING:", loading);
  console.log("ERROR:", error);
  
  useEffect(() => {
    if (!id) return
    dispatch(fetchCharacterById(id))
  }, [dispatch, id])
  
  if (loading || !character) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className={styles.root}>
      <Container>
        <h1>{character.anime?.title}</h1>

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
  
}

export default Character;