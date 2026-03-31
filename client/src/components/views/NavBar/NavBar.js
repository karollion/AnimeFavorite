import styles from './NavBar.module.scss'
import Navbar from 'react-bootstrap/Navbar';
import Button from '../../common/Button/Button';
import Nav from 'react-bootstrap/Nav';
import { getUser } from '../../../redux/reducers/userRedux';
import { NavLink, Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import logo from '../../../assets/logo_S.png';

const NavBar = () => {
  const user = useSelector(getUser);
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
        <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                
                {!user ? (<Button to="/Login">Login</Button>) : null }

                {!user ? (<Button to="/SignUp">Sign up</Button>) : null }

                {!user ? (<Button to={"/Profile/"}>Profile</Button>) : null }

                {!user ? (<Button to="/Logout">Logout</Button>) : null }

                {!user ? (<Button to="/anime/AddAnime">Add New</Button>) : null }
                
              </Nav>
            </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;