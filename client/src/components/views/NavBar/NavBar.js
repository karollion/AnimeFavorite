import styles from './NavBar.module.scss'
import Navbar from 'react-bootstrap/Navbar';
import Button from '../../common/Button/Button';
import { NavLink, Link} from 'react-router-dom';
import { useState } from 'react';
import logo from '../../../assets/logo_S.png';

const NavBar = () => {
  const [expanded] = useState(false);

  return (
    <div className={styles.root}>
      <Navbar expanded={expanded} variant="dark" expand="lg" className={styles.navbar}>
        <Navbar.Brand className={styles.logo} as={NavLink} to="/">
          <img
            src={logo}
            alt="Favorite Anime"
            className={styles.img}
          />
        </Navbar.Brand>
        <div>
            <Button to="/Login">Login</Button>

            <Button to="/SignUp" color="secondary">Sign up</Button>

            <Button to="/Profile">Profile</Button>

            <Button to="/anime/AddAnime" color="primary">Add New</Button>
        </div>
      </Navbar>
    </div>
  );
};

export default NavBar;