import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import styles from './Search.module.scss';

import api from '../../../utils/axios';
import { getUser } from '../../../redux/reducers/userRedux';

import Container from '../../common/container/Container';
import Button from '../../common/Button/Button';
import StatsList from '../../features/StatsList/StatsList';

/**
 * Search page
 *
 * Wyszukuje anime po tytule, a następnie pozwala zmienić sposób
 * prezentowania i sortowania wyników.
 *
 * Ustawienia zapisane w profilu są wartościami domyślnymi.
 * Lokalne przełączenie widoku lub sortowania nie zapisuje zmian
 * w preferencjach użytkownika.
 */
const Search = () => {
  const { t } = useTranslation();
  const user = useSelector(getUser);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  /*
   * null oznacza, że użytkownik nie zmienił ustawienia na tej stronie.
   * Wtedy korzystamy z wartości zapisanej w Settings.
   */
  const [viewOverride, setViewOverride] = useState(null);
  const [sortOverride, setSortOverride] = useState(null);

  const defaultView =
    user?.preferences?.ui?.defaultView === 'list' ? 'list' : 'grid';

  const savedSort = user?.preferences?.behavior?.defaultSort;

  const defaultSort = ['rating', 'newest', 'title'].includes(savedSort)
    ? savedSort
    : 'newest';

  const view = viewOverride ?? defaultView;
  const sort = sortOverride ?? defaultSort;

  /*
   * Wyszukiwanie jest opóźnione o 300 ms, aby nie wysyłać zapytania
   * do serwera po każdym pojedynczym znaku.
   *
   * Endpoint getAll obsługuje wyszukiwanie, sortowanie i paginację.
   */
  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      setResults([]);
      setLoading(false);
      setError('');
      setTotalPages(1);
      setHasSearched(false);
      return undefined;
    }

    let cancelled = false;

    setLoading(true);
    setError('');
    setHasSearched(true);

    const timeoutId = setTimeout(async () => {
      try {
        const response = await api.get('/animes', {
          params: {
            search: normalizedQuery,
            sort,
            page,
            limit: 20,
          },
        });

        if (cancelled) return;

        setResults(response.data.items || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (requestError) {
        if (cancelled) return;

        setResults([]);
        setError(
          requestError.response?.data?.message ||
          'Failed to load search results.'
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [query, sort, page]);

  /*
   * Nowa fraza wyszukiwania zaczyna się od pierwszej strony.
   */
  const handleQueryChange = event => {
    setQuery(event.target.value);
    setPage(1);
  };

  return (
    <div className={styles.root}>
      <Container>
        <h1 className={styles.title}>Search</h1>

        <Form
          className={styles.searchForm}
          onSubmit={event => event.preventDefault()}
        >
          <Form.Group controlId="animeSearch">
            <Form.Label>Anime title</Form.Label>

            <Form.Control
              type="search"
              value={query}
              onChange={handleQueryChange}
              placeholder="Enter at least 2 characters..."
              autoComplete="off"
            />
          </Form.Group>
        </Form>

        <div className={styles.toolbar}>
          <div className={styles.control}>
            <Form.Label htmlFor="searchView">View</Form.Label>

            <Form.Select
              id="searchView"
              value={view}
              onChange={event => setViewOverride(event.target.value)}
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
            </Form.Select>
          </div>

          <div className={styles.control}>
            <Form.Label htmlFor="searchSort">Sort by</Form.Label>

            <Form.Select
              id="searchSort"
              value={sort}
              onChange={event => {
                setSortOverride(event.target.value);
                setPage(1);
              }}
            >
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
              <option value="title">Name (A–Z)</option>
            </Form.Select>
          </div>
        </div>

        {query.trim().length < 2 && (
          <p className={styles.message}>
            Enter at least 2 characters to search.
          </p>
        )}

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {hasSearched && !loading && !error && results.length === 0 && (
          <p className={styles.message}>
            No anime found.
          </p>
        )}

        {(loading || results.length > 0) && (
          <StatsList
            stats={results}
            view={view}
            sort={sort}
            loading={loading}
          />
        )}

        {!loading && totalPages > 1 && (
          <div className={styles.pagination}>
            <Button
              action={() => setPage(current => Math.max(1, current - 1))}
              active={page > 1}
            >
              Previous
            </Button>

            <span>
              Page {page} of {totalPages}
            </span>

            <Button
              action={() =>
                setPage(current => Math.min(totalPages, current + 1))
              }
              active={page < totalPages}
            >
              Next
            </Button>
          </div>
        )}

        <Col xs="12" className="d-flex justify-content-center my-3">
          <Button to="/">
            {t('common.home')}
          </Button>
        </Col>
      </Container>
    </div>
  );
};

export default Search;