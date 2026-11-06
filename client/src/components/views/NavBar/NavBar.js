
import styles from './NavBar.module.scss';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Form, Spinner } from 'react-bootstrap';

import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../common/Button/Button';

import { getUser } from '../../../redux/reducers/userRedux';

import {
  getAnimeSearchResults,
  getAnimeSearchLoading,
  getAnimeSearchError,
  searchAnimeRequest,
  clearAnimeSearch,
} from '../../../redux/reducers/animesRedux';

import logo from '../../../assets/logo_S.png';

const NavBar = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* =====================================================
     REDUX STATE
     ===================================================== */

  const user = useSelector(getUser);

  const searchResults = useSelector(getAnimeSearchResults);
  const isSearching = useSelector(getAnimeSearchLoading);
  const searchError = useSelector(getAnimeSearchError);

  /* =====================================================
     LOCAL STATE
     ===================================================== */

  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  /* =====================================================
     REFS
     ===================================================== */

  const searchRef = useRef(null);

  /* =====================================================
     ANIME SEARCH EFFECT
     ===================================================== */

  /**
   * Dispatches the anime search request after the user
   * pauses typing. A minimum of two characters is required.
   *
   * The debounce prevents unnecessary API requests while
   * the user is entering a search phrase.
   */
  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 2) {
      dispatch(clearAnimeSearch());
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      dispatch(searchAnimeRequest(query)).catch(() => {
        // The Redux thunk already stores the error in its state.
        // The component displays the error inside the search dropdown.
      });
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, dispatch]);

  /* =====================================================
     CLOSE SEARCH ON OUTSIDE CLICK
     ===================================================== */

  /**
   * Closes the autocomplete dropdown when the user clicks
   * outside the search container.
   */
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /* =====================================================
     HANDLERS
     ===================================================== */

  /**
   * Handles the selection of an anime from search results.
   *
   * Clears the search state and navigates to the selected
   * anime detail page.
   *
   * @param {Object} anime - Selected anime object.
   */
  const handleSelectAnime = anime => {
    if (!anime?.slug) return;

    setSearchQuery('');
    setIsSearchOpen(false);
    setExpanded(false);

    dispatch(clearAnimeSearch());

    navigate(`/anime/${anime.slug}`);
  };

  /**
   * Handles navigation to the full search results page.
   */
  const handleShowAllResults = () => {
    const query = searchQuery.trim();

    if (!query) return;

    setIsSearchOpen(false);
    setExpanded(false);

    navigate(`/Search?q=${encodeURIComponent(query)}`);
  };

  /**
   * Handles changes to the search input.
   *
   * @param {Event} event - Input change event.
   */
  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
    setIsSearchOpen(true);
  };

  /**
   * Handles keyboard interactions in the search input.
   *
   * Enter selects the first result.
   * Escape closes the autocomplete dropdown.
   *
   * @param {Event} event - Keyboard event.
   */
  const handleSearchKeyDown = event => {
    if (event.key === 'Enter' && searchResults.length > 0) {
      event.preventDefault();
      handleSelectAnime(searchResults[0]);
    }

    if (event.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  /**
   * Clears the search input and closes the dropdown.
   */
  const handleSearchFocus = () => {
    setIsSearchOpen(true);
  };

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <div className={styles.root}>
      <Navbar
        expanded={expanded}
        onToggle={setExpanded}
        variant="dark"
        expand="lg"
        className={styles.navbar}
      >
        {/* Logo */}
        <Navbar.Brand
          as={NavLink}
          to="/"
          className={styles.logo}
          onClick={() => setExpanded(false)}
        >
          <img
            src={logo}
            alt={t('navBar.altLogo')}
            className={styles.img}
          />
        </Navbar.Brand>

        {/* Mobile navigation toggle */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          aria-expanded={expanded}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">

            {/* =====================================================
                ANIME SEARCH
                ===================================================== */}

            <div
              className={styles.searchContainer}
              ref={searchRef}
            >
              <Form.Control
                type="search"
                placeholder={t('navBar.placeholder')}
                aria-label={t('navBar.aria-label')}
                aria-expanded={
                  isSearchOpen && searchQuery.trim().length >= 2
                }
                aria-controls="anime-search-results"
                autoComplete="off"
                value={searchQuery}
                className={styles.searchInput}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onKeyDown={handleSearchKeyDown}
              />

              {/* Search autocomplete dropdown */}
              {isSearchOpen && searchQuery.trim().length >= 2 && (
                <div
                  id="anime-search-results"
                  className={styles.searchDropdown}
                >
                  {/* Loading state */}
                  {isSearching && (
                    <div className={styles.searchMessage}>
                      <Spinner size="sm" animation="border" />
                      <span>{t('navBar.searching')}</span>
                    </div>
                  )}

                  {/* Error state */}
                  {!isSearching && searchError && (
                    <div className={styles.searchMessage}>
                      {t('navBar.searchfailed')}
                    </div>
                  )}

                  {/* Empty results state */}
                  {!isSearching &&
                    !searchError &&
                    searchResults.length === 0 && (
                      <div className={styles.searchMessage}>
                        {t('navBar.noanimefound')}
                      </div>
                    )}

                  {/* Search results */}
                  {!isSearching &&
                    !searchError &&
                    searchResults.map(anime => (
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

                  {/* Navigate to all search results */}
                  {!isSearching &&
                    !searchError &&
                    searchResults.length > 0 && (
                      <button
                        type="button"
                        className={styles.showAllResults}
                        onClick={handleShowAllResults}
                      >
                        {t('navBar.showAllResults')}
                      </button>
                    )}
                </div>
              )}
            </div>

            {/* =====================================================
                AUTHENTICATION NAVIGATION
                ===================================================== */}

            {!user && (
              <>
                <Button to="/Login">
                  {t('common.login')}
                </Button>

                <Button to="/SignUp">
                  {t('common.signup')}
                </Button>
              </>
            )}

            {user && (
              <>
                <Button to="/Profile">
                  {t('common.profile')}
                </Button>

                <Button to="/Logout">
                  {t('common.logout')}
                </Button>
              </>
            )}

            {/* =====================================================
                ADMIN NAVIGATION
                ===================================================== */}

            {user?.role === 'admin' && (
              <Button to="/anime/AddAnime">
                {t('common.addnew')}
              </Button>
            )}

            {/* =====================================================
                USER NAVIGATION
                ===================================================== */}

            {user && (
              <>
                <Button to="/Settings">
                  {t('common.settings')}
                </Button>

                <Button to="/MyAnimes">
                  {t('common.myanimes')}
                </Button>
              </>
            )}

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
