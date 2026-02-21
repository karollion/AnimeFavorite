import styles from './NavBar.module.scss'
import Navbar from 'react-bootstrap/Navbar';
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
        <Link to="/anime/AddAnime" className={styles.btn}>Add New</Link>
      </Navbar>
    </div>
  );
};

export default NavBar;