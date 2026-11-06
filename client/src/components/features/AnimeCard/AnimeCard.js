
/**
 * @file AnimeCard.js
 * @description Displays an anime card with its cover,
 * age rating, type and average rating.
 */

// Styles
import styles from './AnimeCard.module.scss'

// PropTypes
import PropTypes from 'prop-types'

// Routing
import { Link } from 'react-router-dom'

// Translations
import { useTranslation } from 'react-i18next'

// Assets
import noImage from '../../../assets/no-image.png'

/**
 * AnimeCard component.
 *
 * Displays basic anime information and allows users
 * to navigate to the anime details page by clicking
 * anywhere on the card.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.anime - Anime data.
 * @returns {JSX.Element} The anime card.
 */
const AnimeCard = ({ anime }) => {
  const { t } = useTranslation()

  /**
   * Replaces a missing or unavailable anime cover
   * with the default placeholder image.
   *
   * @param {React.SyntheticEvent<HTMLImageElement>} event
   */
  const handleImageError = event => {
    event.currentTarget.onerror = null
    event.currentTarget.src = noImage
  }

  /**
   * Translates the anime type when a matching translation exists.
   * Falls back to the original value for unknown types.
   */
  const translatedType = anime.type
    ? t(`animeCard.types.${anime.type}`, {
        defaultValue: anime.type,
      })
    : ''

  return (
    <Link
      to={`/anime/${anime.slug}`}
      className={styles.cardLink}
      aria-label={anime.title}
    >
      <div className={styles.card}>

        {/* Anime cover */}
        <img
          src={anime.anime_cover || noImage}
          alt={anime.title || ''}
          className={styles.img}
          onError={handleImageError}
        />

        {/* Anime information panel */}
        <div className={styles.infoPanel}>

          {/* Basic anime information */}
          <div className={styles.top}>
            <p title={t('animeCard.ageRating')}>
              {anime.age_rating != null ? `${anime.age_rating}+` : ''}
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
              {anime.title}
            </span>
          </div>

        </div>
      </div>
    </Link>
  )
}

AnimeCard.propTypes = {
  anime: PropTypes.object.isRequired,
}

export default AnimeCard
