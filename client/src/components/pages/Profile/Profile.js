import styles from './Profile.module.scss'
import noImage from '../../../assets/no-image.png'
import { Col } from 'react-bootstrap'
import Container from '../../common/container/Container';
import Button from '../../common/Button/Button';
import {
  getUser,
  getUserStats
} from '../../../redux/reducers/userRedux';
import { useSelector } from 'react-redux';
import CharacterCard from '../../features/CharacterCard/CharacterCard';
import AnimeCard from '../../features/AnimeCard/AnimeCard';

const Profile = () => {
  const user = useSelector(getUser);
  const stats = useSelector(getUserStats);

  console.log("User data: ");
  console.log(user);
  console.log("User stats: ");
  console.log(stats);
  
  return (
    <div className={styles.root}>
      <Container>
        <img
          src={user.avatar || noImage}
          alt={user.login}
          className={styles.img}
        />
        
        
        <h1>User Profile</h1>
        <p>Login: {user.login}</p>
        <p>Role: {user.role}</p>
        <p>Description: {user.description}</p>
        <p>Email: {user.email}</p>
        <p>Birth year: {user.birth_year}</p>

        <p>Favorite characters:</p>
        <p>number of favorite characters {user.favorite_characters_count}</p>
        <div className={styles.characters}>
          {user.favorite_characters?.map(c => (
            <div key={c._id} >
              <CharacterCard character={c} />
            </div>
          ))}
        </div>

        <p>Favorite animes:</p>
        <div>
          {stats?.favoriteAnime?.map(anime => (
            <AnimeCard
              key={anime._id}
              anime={anime}
            />
          ))}
        </div>
        
        <p>Watching: {stats?.statuses?.watching}</p>
        <p>Completed: {stats?.statuses?.completed}</p>
        <p>Planned: {stats?.statuses?.planned}</p>
        <p>Suspended: {stats?.statuses?.suspended}</p>
        <p>Abandoned: {stats?.statuses?.abandoned}</p>

          
        <Col xs="12" className="d-flex justify-content-center my-3">
          <Button to="/">Back to home</Button>
        </Col>
      </Container>
    </div>
  );
};

export default Profile;