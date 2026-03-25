import styles from './AddAnime.module.scss';
import AnimeForm from '../../features/AnimeForm/AnimeForm';
import Container from '../../common/container/Container';

const AddAnime = () => {
  
  return (
    <Container>
      <div className={styles.root}>
        <h1>Add new anime</h1>
        <AnimeForm/>
      </div>
    </Container>
  )
}

export default AddAnime;