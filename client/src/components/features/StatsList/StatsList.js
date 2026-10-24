import styles from './StatsList.module.scss';
import PropTypes from 'prop-types';

import StatCard from '../StatCard/StatCard';
import SkeletonCard from '../StatCard/SkeletonCard';
import AnimeCard from '../AnimeCard/AnimeCard';
import SkeletonAnimeCard from '../AnimeCard/SkeletonAnimeCard';

/**
 * Sortuje przekazaną kolekcję anime.
 *
 * rating - najwyższa ocena na początku;
 * newest - najnowszy rekord na początku;
 * title  - tytuł alfabetycznie A-Z.
 *
 * Sortowanie tworzy nową tablicę. Nie modyfikujemy bezpośrednio
 * tablicy pochodzącej z Redux ani obiektu statystyk użytkownika.
 */
const sortAnimes = (animes, sort) => {
  const sorted = [...animes];

  switch (sort) {
    case 'rating':
      return sorted.sort(
        (a, b) => (Number(b.rating_avg) || 0) - (Number(a.rating_avg) || 0)
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

const StatsList = ({
  stats = [],
  view = 'list',
  sort = 'newest',
  loading = false,
}) => {
  /*
   * Pustej tablicy nie traktujemy automatycznie jako stanu ładowania.
   * W przeciwnym razie użytkownik z pustą kolekcją widziałby skeletony
   * zamiast informacji, że nie ma jeszcze żadnych anime.
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
            <div className={styles.gridItem} key={`skeleton-${index}`}>
              <SkeletonAnimeCard />
            </div>
          ) : (
            <SkeletonCard key={`skeleton-${index}`} />
          )
        )}
      </div>
    );
  }

  if (!stats.length) {
    return (
      <p className={styles.empty}>
        No anime in this collection yet.
      </p>
    );
  }

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

StatsList.propTypes = {
  stats: PropTypes.array,
  view: PropTypes.oneOf(['grid', 'list']),
  sort: PropTypes.oneOf(['rating', 'newest', 'title']),
  loading: PropTypes.bool,
};

export default StatsList;