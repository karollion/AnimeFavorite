import styles from './AddAnime.module.scss'
import AnimeForm from '../../features/AnimeForm/AnimeForm'

const AddAnime = () => {
  
  return (
    <div className={styles.root}>
      <h1>Add new anime</h1>
      <AnimeForm/>
    </div>
  )
}

export default AddAnime;