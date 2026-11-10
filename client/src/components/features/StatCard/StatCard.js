
/* =====================================================
   COMPONENTS
   ===================================================== */

import styles from './StatCard.module.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import noImage from '../../../assets/no-image.png';

/* =====================================================
   STAT CARD COMPONENT
   ===================================================== */

/**
 * @component
 * @description Displays an anime entry in a compact list format.
 *              Includes its cover, title, age rating, type and average rating.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.anime - Anime data to display.
 *
 * @returns {JSX.Element} The rendered anime statistics card.
 */
const StatCard = ({ anime }) => {
  const { t } = useTranslation();

  /* =====================================================
     COMPONENT DATA
     ===================================================== */

  // Use a fallback image when the anime cover is unavailable.
  const cover = anime?.anime_cover || noImage;

  // Resolve the anime type using the corresponding translation key.
  const animeType = anime?.type
    ? t(`animeCard.types.${anime.type}`, { defaultValue: anime.type })
    : '—';

  return (
    <div>
      <div className={styles.card}>

        {/* Anime cover */}
        <img
          src={cover}
          alt={anime?.title || t('animeCard.coverAlt')}
          className={styles.img}
        />

        {/* Anime title and details link */}
        <div className={styles.title}>
          <Link
            to={`/anime/${anime.slug}`}
            className={styles.btn}
          >
            {anime.title}
          </Link>
        </div>

        {/* Anime metadata */}
        <div className={styles.info}>
          <p>
            {anime?.age_rating != null
              ? `${anime.age_rating}+`
              : '—'}
          </p>

          <p>{animeType}</p>

          <p>
            {anime?.rating_avg != null
              ? anime.rating_avg
              : '—'}
          </p>
        </div>

      </div>
    </div>
  );
};

/* =====================================================
   PROP TYPES
   ===================================================== */

StatCard.propTypes = {
  anime: PropTypes.object.isRequired,
};

export default StatCard;
