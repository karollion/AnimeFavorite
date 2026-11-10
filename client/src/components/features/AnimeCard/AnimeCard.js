
/* =====================================================
   Anime Card
   ===================================================== */

/**
 * @file AnimeCard.js
 * @description Displays an anime card with its cover,
 * age rating, type and average rating.
 */

/* =====================================================
   STYLES
   ===================================================== */

import styles from './AnimeCard.module.scss'

/* =====================================================
   DEPENDENCIES
   ===================================================== */

import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/* =====================================================
   ASSETS
   ===================================================== */

import noImage from '../../../assets/no-image.png'

/* =====================================================
   COMPONENT
   ===================================================== */

/**
 * Displays basic anime information and provides navigation
 * to the anime details page.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.anime - Anime data.
 * @returns {JSX.Element} The anime card.
 */
const AnimeCard = ({ anime }) => {
  const { t } = useTranslation()

  /* =====================================================
     IMAGE HANDLING
     ===================================================== */

  /**
   * Replaces a missing or unavailable anime cover
   * with the default placeholder image.
   *
   * Prevents an infinite error loop if the fallback
   * image is also unavailable.
   *
   * @param {React.SyntheticEvent<HTMLImageElement>} event
   */
  const handleImageError = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = noImage
  }

  /* =====================================================
     ANIME TYPE TRANSLATION
     ===================================================== */

  /**
   * Translates the anime type when a matching translation exists.
   * Falls back to the original value for unknown types.
   */
  const translatedType = anime.type
    ? t(`animeCard.types.${anime.type}`, {
        defaultValue: anime.type,
      })
    : '—'

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <Link
      to={`/anime/${anime.slug}`}
      className={styles.cardLink}
      aria-label={anime.title || t('animeCard.unknownTitle')}
    >
      <div className={styles.card}>

        {/* Anime cover */}
        <img
          src={anime.anime_cover || noImage}
          alt={anime.title || t('animeCard.coverAlt')}
          className={styles.img}
          onError={handleImageError}
        />

        {/* Anime information panel */}
        <div className={styles.infoPanel}>

          {/* Basic anime information */}
          <div className={styles.top}>
            <p title={t('animeCard.ageRating')}>
              {anime.age_rating != null
                ? `${anime.age_rating}+`
                : '—'}
            </p>

            <p title={t('animeCard.type')}>
              {translatedType}
            </p>

            <p title={t('animeCard.rating')}>
              {anime.rating_avg ?? '—'}
            </p>
          </div>

          {/* Anime title */}
          <div className={styles.bottom}>
            <span className={styles.animeTitle}>
              {anime.title || t('animeCard.unknownTitle')}
            </span>
          </div>

        </div>
      </div>
    </Link>
  )
}

/* =====================================================
   PROP TYPES
   ===================================================== */

AnimeCard.propTypes = {
  anime: PropTypes.object.isRequired,
}

export default AnimeCard
