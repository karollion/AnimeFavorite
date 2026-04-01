import styles from './Profile.module.scss'
import noImage from '../../../assets/no-image.png'
import { Col } from 'react-bootstrap'
import Container from '../../common/container/Container';
import Button from '../../common/Button/Button';
import {
  getUser,
  fetchUserStats
} from '../../../redux/reducers/userRedux';
import { useDispatch, useSelector } from 'react-redux';
import CharacterCard from '../../features/CharacterCard/CharacterCard';
import { useEffect } from 'react';

const Profile = () => {
  const dispatch = useDispatch()

  const user = useSelector(getUser);
    
  useEffect(() => {
    dispatch(fetchUserStats())
  }, [dispatch])

  return (
    <div className={styles.root}>
      <Container>
        <img
          src={user.avatar || noImage}
          alt={user.login}
          className={styles.img}
        />
        
        <p>avatar: {user.avatar}</p>
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

          
        <Col xs="12" className="d-flex justify-content-center my-3">
          <Button to="/">Back to home</Button>
        </Col>
      </Container>
    </div>
  );
};

export default Profile;