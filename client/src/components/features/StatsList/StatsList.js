
/* =====================================================
   COMPONENTS
   ===================================================== */

import styles from './StatsList.module.scss';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import StatCard from '../StatCard/StatCard';
import SkeletonCard from '../StatCard/SkeletonCard';
import AnimeCard from '../AnimeCard/AnimeCard';
import SkeletonAnimeCard from '../AnimeCard/SkeletonAnimeCard';

/* =====================================================
   SORTING
   ===================================================== */

/**
 * Sorts the provided anime collection according to the selected criterion.
 *
 * Supported sorting options:
 * - rating: Highest average rating first.
 * - newest: Most recently created anime first.
 * - title: Alphabetical order (A-Z).
 *
 * A copy of the original array is created before sorting to avoid
 * directly modifying data received from Redux.
 *
 * @param {Array} animes - Anime collection to sort.
 * @param {string} sort - Selected sorting criterion.
 * @returns {Array} Sorted copy of the anime collection.
 */
const sortAnimes = (animes, sort) => {
  const sorted = [...animes];

  switch (sort) {
    case 'rating':
      return sorted.sort(
        (a, b) =>
          (Number(b.rating_avg) || 0) -
          (Number(a.rating_avg) || 0)
      );

    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );

    case 'title':
      return sorted.sort((a, b) =>
        (a.title || '').localeCompare(
          b.title || '',
          undefined,
          { sensitivity: 'base' }
        )
      );

    default:
      return sorted;
  }
};

/* =====================================================
   STATS LIST COMPONENT
   ===================================================== */

/**
 * @component
 * @description Displays a collection of anime statistics in either
 *              grid or list view. Supports sorting and loading skeletons.
 *
 * @param {Object} props - Component properties.
 * @param {Array} props.stats - Anime collection to display.
 * @param {string} props.view - Display mode: "grid" or "list".
 * @param {string} props.sort - Sorting criterion.
 * @param {boolean} props.loading - Indicates whether the collection is loading.
 *
 * @returns {JSX.Element} The rendered anime collection.
 */
const StatsList = ({
  stats = [],
  view = 'list',
  sort = 'newest',
  loading = false,
}) => {
  const { t } = useTranslation();

  /* =====================================================
     LOADING STATE
     ===================================================== */

  /**
   * Displays placeholder cards while the anime collection is loading.
   *
   * An empty collection is not treated as a loading state.
   * This ensures that users with no anime entries see an appropriate
   * empty-state message instead of permanent skeletons.
   */
  if (loading) {
    return (
      <div
        className={`${styles.root} ${
          view === 'grid' ? styles.grid : styles.list
        }`}
      >
        {Array.from({ length: 8 }, (_, index) =>
          view === 'grid' ? (
            <div
              className={styles.gridItem}
              key={`skeleton-${index}`}
            >
              <SkeletonAnimeCard />
            </div>
          ) : (
            <SkeletonCard key={`skeleton-${index}`} />
          )
        )}
      </div>
    );
  }

  /* =====================================================
     EMPTY STATE
     ===================================================== */

  /**
   * Displays a translated message when the collection contains no anime.
   */
  if (!stats.length) {
    return (
      <p className={styles.empty}>
        {t('myAnimes.emptyCollection')}
      </p>
    );
  }

  /* =====================================================
     ANIME COLLECTION
     ===================================================== */

  /**
   * Sorts the collection before rendering it.
   */
  const sortedAnimes = sortAnimes(stats, sort);

  return (
    <div
      className={`${styles.root} ${
        view === 'grid' ? styles.grid : styles.list
      }`}
    >
      {sortedAnimes.map(anime =>
        view === 'grid' ? (
          <div className={styles.gridItem} key={anime._id}>
            <AnimeCard anime={anime} />
          </div>
        ) : (
          <StatCard anime={anime} key={anime._id} />
        )
      )}
    </div>
  );
};

/* =====================================================
   PROP TYPES
   ===================================================== */

StatsList.propTypes = {
  stats: PropTypes.array,
  view: PropTypes.oneOf(['grid', 'list']),
  sort: PropTypes.oneOf(['rating', 'newest', 'title']),
  loading: PropTypes.bool,
};

export default StatsList;
