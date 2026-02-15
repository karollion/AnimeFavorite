import styles from './NavBar.module.scss'
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import logo from '../../../assets/logo_S.png';

const NavBar = () => {
  const [expanded, setExpanded] = useState(false);

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
      </Navbar>
      <h2>navbar</h2>
    </div>
  );
};

export default NavBar;