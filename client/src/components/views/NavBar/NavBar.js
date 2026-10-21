import styles from './NavBar.module.scss'
import Navbar from 'react-bootstrap/Navbar';
import Button from '../../common/Button/Button';
import Nav from 'react-bootstrap/Nav';
import { getUser } from '../../../redux/reducers/userRedux';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import logo from '../../../assets/logo_S.png';
import {
  getAnimeSearchResults,
  getAnimeSearchLoading,
  getAnimeSearchError,
  searchAnimeRequest,
  clearAnimeSearch
} from '../../../redux/reducers/animesRedux';

const NavBar = () => {
  const user = useSelector(getUser);
  const [expanded, setExpanded] = useState(false);

  /* =====================================================
   Anime Search
   ===================================================== */

  /**
   * Stores the search query, autocomplete results and loading
   * state. The request is delayed slightly so the API is not
   * called after every single keystroke.
   */
  const dispatch = useDispatch();

  const searchResults = useSelector(getAnimeSearchResults);
  const isSearching = useSelector(getAnimeSearchLoading);
  const searchError = useSelector(getAnimeSearchError);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchRef = useRef(null);
  const navigate = useNavigate();

  /* =====================================================
     Anime Search Effect
     ===================================================== */

  /**
   * @description Dispatches the Redux search thunk after the
   * user pauses typing. A minimum of two characters is required.
   */
  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 2) {
      dispatch(clearAnimeSearch());
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      dispatch(searchAnimeRequest(query)).catch(() => {
        // The Redux thunk already stores the error in the state.
      });
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, dispatch]);

  /**
   * Close the suggestions when the user clicks outside the
   * search area.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  /**
   * Navigate to the selected anime detail page.
   */
  const handleSelectAnime = (anime) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    dispatch(clearAnimeSearch());
    
    if (anime.slug) {
      navigate(`/anime/${anime.slug}`);
      setExpanded(false);
    }
  };

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

                {/* =====================================================
                    Anime Search Input and Autocomplete Results
                    ===================================================== */}

                <div className={styles.searchContainer} ref={searchRef}>
                  <Form.Control
                    type="search"
                    placeholder="Search anime..."
                    aria-label="Search anime by title"
                    autoComplete="off"
                    value={searchQuery}
                    className={styles.searchInput}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Enter' &&
                        searchResults.length > 0
                      ) {
                        event.preventDefault();
                        handleSelectAnime(searchResults[0]);
                      }
                    
                      if (event.key === 'Escape') {
                        setIsSearchOpen(false);
                      }
                    }}
                  />

                  {isSearchOpen && searchQuery.trim().length >= 2 && (
                    <div className={styles.searchDropdown}>
                      {isSearching && (
                        <div className={styles.searchMessage}>
                          <Spinner size="sm" animation="border" />
                          <span>Searching...</span>
                        </div>
                      )}

                      {!isSearching && searchError && (
                        <div className={styles.searchMessage}>
                          Search failed. Please try again.
                        </div>
                      )}

                      {!isSearching &&
                        !searchError &&
                        searchResults.length === 0 && (
                          <div className={styles.searchMessage}>
                            No anime found.
                          </div>
                        )}

                      {!isSearching &&
                        !searchError &&
                        searchResults.map((anime) => (
                          <button
                            key={anime._id}
                            type="button"
                            className={styles.searchResult}
                            onClick={() => handleSelectAnime(anime)}
                          >
                            {anime.anime_cover && (
                              <img
                                src={anime.anime_cover}
                                alt=""
                                className={styles.searchCover}
                              />
                            )}

                            <span className={styles.searchResultInfo}>
                              <span className={styles.searchTitle}>
                                {anime.title}
                              </span>
                          
                              {anime.original_title && (
                                <span className={styles.searchOriginalTitle}>
                                  {anime.original_title}
                                </span>
                              )}

                              {anime.type && (
                                <span className={styles.searchType}>
                                  {anime.type}
                                </span>
                              )}
                            </span>
                          </button>
                        ))}

                      {!isSearching &&
                        !searchError &&
                        searchResults.length > 0 && (
                          <button
                            type="button"
                            className={styles.showAllResults}
                            onClick={() => {
                              navigate(
                                `/Search?query=${encodeURIComponent(searchQuery.trim())}`
                              );
                              setIsSearchOpen(false);
                              setExpanded(false);
                            }}
                          >
                            Show all results
                          </button>
                        )}
                    </div>
                  )}
                </div>
                
                {!user ? (<Button to="/Login">Login</Button>) : null }

                {!user ? (<Button to="/SignUp">Sign up</Button>) : null }

                {user ? (<Button to={"/Profile"}>Profile</Button>) : null }

                {user ? (<Button to="/Logout">Logout</Button>) : null }
                
                {user?.role === 'admin' && (<Button to="/anime/AddAnime">Add New</Button>)}
                
                {user ? (<Button to="/Settings">Settings</Button>) : null }

                {user ? (<Button to="/MyAnimes">My animes</Button>) : null }
                
              </Nav>
            </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;