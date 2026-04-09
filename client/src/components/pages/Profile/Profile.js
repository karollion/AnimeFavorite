import styles from './Profile.module.scss'
import noImage from '../../../assets/no-image.png'
import { motion, AnimatePresence } from 'framer-motion';
import { Col } from 'react-bootstrap'
import Container from '../../common/container/Container';
import Button from '../../common/Button/Button';
import {
  getUser,
  getUserStats
} from '../../../redux/reducers/userRedux';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import CharacterCard from '../../features/CharacterCard/CharacterCard';
import StatsList from '../../features/StatsList/StatsList';

const Profile = () => {

  const user = useSelector(getUser);
  const stats = useSelector(getUserStats);
  const [activeTab, setActiveTab] = useState('favorites');
  
  return (
    <div className={styles.root}>
      <Container>
        <h1>User Profile</h1>
        <div className={styles.about}>
          <img
            src={user.avatar || noImage}
            alt={user.login}
            className={styles.img}
          />
          <div>
            <p>Login: {user.login}</p>
            <p>Role: {user.role}</p>
            <p>Email: {user.email}</p>
            <p>Birth year: {user.birth_year}</p>
            <p>Description: {user.description}</p>
          </div>
        </div>
        <p>Favorite characters:</p>
        <div className={styles.characters}>
          {user.favorite_characters?.map(c => (
            <div key={c._id} >
              <CharacterCard character={c} />
            </div>
          ))}
        </div>

        <div className={styles.stats_nav}>
          <Button
            action={() => setActiveTab('favorites')}
            active={activeTab !== 'favorites'}>
            Favorites [{stats?.favoriteAnime?.length}]
          </Button>
          <Button 
            action={() => setActiveTab('watching')}
            active={activeTab !== 'watching'}>
              Watching [{stats?.statuses?.watching?.count}]
          </Button>
          <Button 
            action={() => setActiveTab('completed')}
            active={activeTab !== 'completed'}>
              Completed [{stats?.statuses?.completed?.count}]
          </Button>
          <Button 
            action={() => setActiveTab('planned')}
            active={activeTab !== 'planned'}>
              Planned [{stats?.statuses?.planned?.count}]
          </Button>
          <Button 
            action={() => setActiveTab('suspended')}
            active={activeTab !== 'suspended'}>
              Suspended [{stats?.statuses?.suspended?.count}]
          </Button>
          <Button 
            action={() => setActiveTab('abandoned')}
            active={activeTab !== 'abandoned'}>
              Abandoned [{stats?.statuses?.abandoned?.count}]
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >

            {activeTab === 'favorites' && (
              <><StatsList stats={stats?.favoriteAnime || []} /></>
            )}

            {activeTab === 'watching' && (
              <><StatsList stats={stats?.statuses?.watching?.anime || []} /></>
            )}

            {activeTab === 'completed' && (
              <><StatsList stats={stats?.statuses?.completed?.anime || []} /></>
            )}

            {activeTab === 'planned' && (
              <><StatsList stats={stats?.statuses?.planned?.anime || []} /></>
            )}

            {activeTab === 'suspended' && (
              <><StatsList stats={stats?.statuses?.suspended?.anime || []} /></>
            )}

            {activeTab === 'abandoned' && (
              <><StatsList stats={stats?.statuses?.abandoned?.anime || []} /></>
            )}

          </motion.div>
        </AnimatePresence>
        
        <Col xs="12" className="d-flex justify-content-center my-3">
          <Button to="/">Back to home</Button>
        </Col>
      </Container>
    </div>
  );
};

export default Profile;