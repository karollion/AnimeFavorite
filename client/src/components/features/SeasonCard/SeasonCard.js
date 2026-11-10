
/* =====================================================
   SEASON CARD
   ===================================================== */

/**
 * @file SeasonCard.js
 * @description Displays a season card with its cover,
 *              release year, rating and title.
 */

/* =====================================================
   STYLES
   ===================================================== */

import styles from './SeasonCard.module.scss'

/* =====================================================
   DEPENDENCIES
   ===================================================== */

import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

/* =====================================================
   ASSETS
   ===================================================== */

import noImage from '../../../assets/no-image.png'
import { Link } from 'react-router-dom'

/* =====================================================
   COMPONENT
   ===================================================== */

/**
 * Displays basic season information.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.season - Season data.
 * @returns {JSX.Element} The season card.
 */
const SeasonCard = ({ season }) => {
  const { t } = useTranslation()

  /* =====================================================
     IMAGE HANDLING
     ===================================================== */

  /**
   * Replaces a missing or unavailable season cover
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
     RELEASE YEAR
     ===================================================== */

  /**
   * Extracts the release year from a date value.
   * Returns an em dash when the date is missing or invalid.
   *
   * @param {string|Date} date - Season release date.
   * @returns {string|number} Release year or fallback value.
   */
  const getReleaseYear = (date) => {
    if (!date) return '—'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return '—'
    }

    return parsedDate.getFullYear()
  }

  /* =====================================================
     DISPLAY VALUES
     ===================================================== */

  const title = season.title || t('seasonCard.unknownTitle')
  const rating = season.rating ?? '—'
  const releaseYear = getReleaseYear(season.release_date)

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <Link
      to={`/seasons/${season._id}`}
      className={styles.cardLink}
      aria-label={t('seasonCard.openSeason', {
        name: title,
      })}
    >
      <article className={styles.card}>
        {/* Season cover */}
        <img
          src={season.season_cover || noImage}
          alt={t('seasonCard.coverAlt', { title })}
          className={styles.img}
          onError={handleImageError}
          loading="lazy"
        />

        {/* Season information panel */}
        <div className={styles.infoPanel}>
          {/* Release year and rating */}
          <div className={styles.top}>
            <span
              className={styles.releaseYear}
              title={t('seasonCard.releaseYear')}
            >
              {releaseYear}
            </span>

            <span
              className={styles.rating}
              title={t('seasonCard.rating')}
            >
              {rating}
            </span>
          </div>

          {/* Season title */}
          <div className={styles.bottom}>
            <h3 className={styles.seasonTitle}>
              {title}
            </h3>
          </div>
        </div>
      </article>
    </Link>
  )
}

/* =====================================================
   PROP TYPES
   ===================================================== */

SeasonCard.propTypes = {
  season: PropTypes.object.isRequired,
}

export default SeasonCard
