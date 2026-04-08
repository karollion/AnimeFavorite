import styles from './Profile.module.scss'
import noImage from '../../../assets/no-image.png'
import { Col } from 'react-bootstrap'
import Container from '../../common/container/Container';
import Button from '../../common/Button/Button';
import {
  getUser,
  fetchProfile,
  getUserStats
} from '../../../redux/reducers/userRedux';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import CharacterCard from '../../features/CharacterCard/CharacterCard';
import AnimeCard from '../../features/AnimeCard/AnimeCard';
import StatsList from '../../features/StatsList/StatsList';

const Profile = () => {
  const dispatch = useDispatch();

  const user = useSelector(getUser);
  const stats = useSelector(getUserStats);

  //useEffect(() => {
  //  dispatch(fetchProfile());
  //}, [dispatch]);

  //console.log("User data: ");
  //console.log(user);
  //console.log("User stats: ");
  //console.log(stats);
  
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
        <div className={styles.characters}>
          {user.favorite_characters?.map(c => (
            <div key={c._id} >
              <CharacterCard character={c} />
            </div>
          ))}
        </div>

        <div className={styles.stats_nav}>
          <Button action="OnClick">Favorites</Button>
          <Button action="OnClick">Watching</Button>
          <Button action="OnClick">Completed</Button>
          <Button action="OnClick">Planned</Button>
          <Button action="OnClick">Suspended</Button>
          <Button action="OnClick">Abandoned</Button>
        </div>

        <p>Favorite:</p>
        <p>Total favorites: {stats?.favoriteAnime.length}</p>
        <StatsList stats={stats?.favoriteAnime} />
        
        <p>Total watching: {stats?.statuses?.watching.count}</p>
        <StatsList stats={stats?.statuses?.watching.anime} />

        <p>Total completed: {stats?.statuses?.completed.count}</p>
        <StatsList stats={stats?.statuses?.completed.anime} />

        <p>Total planned: {stats?.statuses?.planned.count}</p>
        <StatsList stats={stats?.statuses?.planned.anime} />

        <p>Total suspended: {stats?.statuses?.suspended.count}</p>
        <StatsList stats={stats?.statuses?.suspended.anime} />

        <p>Total abandoned: {stats?.statuses?.abandoned.count}</p>
        <StatsList stats={stats?.statuses?.abandoned.anime} />
        

        <Col xs="12" className="d-flex justify-content-center my-3">
          <Button to="/">Back to home</Button>
        </Col>
      </Container>
    </div>
  );
};

export default Profile;