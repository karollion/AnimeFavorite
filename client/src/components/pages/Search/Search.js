
/**
 * @file Search.js
 * @description Allows users to search for anime, change the
 * results layout, sort entries and navigate between pages.
 *
 * User preferences provide the default view and sorting method.
 * Changes made locally on this page do not modify saved preferences.
 */

// React
import { useEffect, useState } from 'react'

// Redux
import { useSelector } from 'react-redux'
import { getUser } from '../../../redux/reducers/userRedux'

// React Bootstrap
import { Col, Form } from 'react-bootstrap'

// Routing
import { useSearchParams } from 'react-router-dom'

// Translations
import { useTranslation } from 'react-i18next'

// Styles
import styles from './Search.module.scss'

// API
import api from '../../../utils/axios'

// Context
import { useMessage } from '../../../context/MessageContext'

// Components
import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'
import StatsList from '../../features/StatsList/StatsList'

/**
 * @component
 * @description Renders the anime search page.
 *
 * Features:
 * - Debounced anime search.
 * - Grid and list result layouts.
 * - Sorting by rating, release date or title.
 * - Pagination.
 * - Default settings loaded from the authenticated user's profile.
 *
 * @returns {JSX.Element} The search page.
 */
const Search = () => {
  const user = useSelector(getUser)

  const { t } = useTranslation()
  const { showMessage } = useMessage()

  const [searchParams] = useSearchParams()

  // Read the initial search query from the URL.
  const queryFromUrl = searchParams.get('q') || ''

  // Search and pagination state.
  const [query, setQuery] = useState(queryFromUrl)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasSearched, setHasSearched] = useState(false)

  /*
   * Local overrides take precedence over saved user preferences.
   * A null value means that the user has not changed the setting
   * during the current page session.
   */
  const [viewOverride, setViewOverride] = useState(null)
  const [sortOverride, setSortOverride] = useState(null)

  // Resolve the default layout from the user's saved preferences.
  const savedView = user?.preferences?.ui?.defaultView

  const defaultView = savedView === 'list'
    ? 'list'
    : 'grid'

  // Resolve the default sorting method from user preferences.
  const savedSort = user?.preferences?.behavior?.defaultSort

  const defaultSort = ['rating', 'newest', 'title'].includes(savedSort)
    ? savedSort
    : 'newest'

  // Apply local overrides when available.
  const view = viewOverride ?? defaultView
  const sort = sortOverride ?? defaultSort

  /*
   * Synchronizes the search field with the query parameter.
   * This also resets pagination when the URL query changes.
   */
  useEffect(() => {
    setQuery(queryFromUrl)
    setPage(1)
  }, [queryFromUrl])

  /*
   * Performs a debounced search.
   *
   * Requests are delayed by 300 ms to avoid sending an API
   * request after every individual keystroke.
   *
   * The cleanup function prevents outdated requests from
   * updating component state or displaying error messages.
   */
  useEffect(() => {
    const normalizedQuery = query.trim()

    // Do not search for queries shorter than two characters.
    if (normalizedQuery.length < 2) {
      setResults([])
      setLoading(false)
      setError(false)
      setTotalPages(1)
      setHasSearched(false)

      return undefined
    }

    let cancelled = false

    setLoading(true)
    setError(false)
    setHasSearched(true)

    const timeoutId = setTimeout(async () => {
      try {
        const response = await api.get('/animes', {
          params: {
            search: normalizedQuery,
            sort,
            page,
            limit: 20,
          },
        })

        // Ignore the response if the request is no longer relevant.
        if (cancelled) return

        setResults(response.data.items || [])
        setTotalPages(response.data.totalPages || 1)
      } catch (requestError) {
        // Ignore errors from outdated requests.
        if (cancelled) return

        setResults([])
        setError(true)

        // Display API errors using the global message component.
        await showMessage({
          title: t('common.error'),
          message: t('search.loadFailed'),
          mode: 'alert',
          confirmText: t('common.ok'),
        })
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }, 300)

    // Cancel the pending request handler when dependencies change.
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [query, sort, page, showMessage, t])

  /**
   * Updates the search query and resets pagination.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleQueryChange = event => {
    setQuery(event.target.value)
    setPage(1)
  }

  /**
   * Changes the results layout.
   * The selected value is stored locally and does not modify
   * the user's saved preferences.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event
   */
  const handleViewChange = event => {
    setViewOverride(event.target.value)
  }

  /**
   * Changes the sorting method and returns to the first page.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event
   */
  const handleSortChange = event => {
    setSortOverride(event.target.value)
    setPage(1)
  }

  /**
   * Moves to the previous results page.
   */
  const handlePreviousPage = () => {
    setPage(current => Math.max(1, current - 1))
  }

  /**
   * Moves to the next results page.
   */
  const handleNextPage = () => {
    setPage(current => Math.min(totalPages, current + 1))
  }

  return (
    <div className={styles.root}>
      <Container>

        {/* Page heading */}
        <h1 className={styles.title}>
          {t('common.search')}
        </h1>

        {/* Search input */}
        <Form
          className={styles.searchForm}
          onSubmit={event => event.preventDefault()}
        >
          <Form.Group controlId="animeSearch">
            <Form.Label>
              {t('search.inputLabel')}
            </Form.Label>

            <Form.Control
              type="search"
              value={query}
              onChange={handleQueryChange}
              placeholder={t('search.placeholder')}
              autoComplete="off"
            />
          </Form.Group>
        </Form>

        {/* Search result controls */}
        <div className={styles.toolbar}>

          {/* Results layout */}
          <div className={styles.control}>
            <Form.Label htmlFor="searchView">
              {t('search.view')}
            </Form.Label>

            <Form.Select
              id="searchView"
              value={view}
              onChange={handleViewChange}
            >
              <option value="grid">
                {t('settings.grid')}
              </option>

              <option value="list">
                {t('settings.list')}
              </option>
            </Form.Select>
          </div>

          {/* Results sorting */}
          <div className={styles.control}>
            <Form.Label htmlFor="searchSort">
              {t('search.sortBy')}
            </Form.Label>

            <Form.Select
              id="searchSort"
              value={sort}
              onChange={handleSortChange}
            >
              <option value="rating">
                {t('settings.defrating')}
              </option>

              <option value="newest">
                {t('settings.defnewest')}
              </option>

              <option value="title">
                {t('settings.deftitle')} (A–Z)
              </option>
            </Form.Select>
          </div>

        </div>

        {/* Minimum search query length */}
        {query.trim().length < 2 && (
          <p className={styles.message}>
            {t('search.minCharacters')}
          </p>
        )}

        {/* No results information */}
        {hasSearched && !loading && !error && results.length === 0 && (
          <p className={styles.message}>
            {t('search.noResults')}
          </p>
        )}

        {/* Search results */}
        {(loading || results.length > 0) && (
          <StatsList
            stats={results}
            view={view}
            sort={sort}
            loading={loading}
          />
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className={styles.pagination}>

            <Button
              action={handlePreviousPage}
              active={page > 1}
            >
              {t('search.previous')}
            </Button>

            <span>
              {t('search.page', {
                current: page,
                total: totalPages,
              })}
            </span>

            <Button
              action={handleNextPage}
              active={page < totalPages}
            >
              {t('search.next')}
            </Button>

          </div>
        )}

        {/* Return to the home page */}
        <Col xs="12" className="d-flex justify-content-center my-3">
          <Button to="/">
            {t('common.home')}
          </Button>
        </Col>

      </Container>
    </div>
  )
}

export default Search
