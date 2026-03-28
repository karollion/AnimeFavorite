import styles from './AddAnime.module.scss';
import AnimeForm from '../../features/AnimeForm/AnimeForm';
import Container from '../../common/container/Container';

const AddAnime = () => {
  
  return (
    <div className={styles.root}>
      <Container>
        <h1>Add new anime</h1>
        <AnimeForm/>
      </Container>
    </div>
  )
}

export default AddAnime;