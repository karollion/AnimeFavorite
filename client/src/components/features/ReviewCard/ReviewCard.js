
/* =====================================================
   Review Card
   ===================================================== */

/**
 * @file ReviewCard.js
 * @description Displays a user review with their avatar,
 * username, review text and rating.
 * Spoiler-containing reviews are blurred until hovered
 * or focused.
 */

/* =====================================================
   STYLES AND DEPENDENCIES
   ===================================================== */

import styles from './ReviewCard.module.scss'

import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

/* =====================================================
   ASSETS
   ===================================================== */

import noImage from '../../../assets/no-image.png'

/* =====================================================
   COMPONENT
   ===================================================== */

/**
 * Displays an individual anime review.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.review - Review data.
 * @returns {JSX.Element} Review card.
 */
const ReviewCard = ({ review }) => {
  const { t } = useTranslation()

  /* =====================================================
     REVIEW DATA
     ===================================================== */

  const username = review.user?.login || '—'
  const avatar = review.user?.avatar || noImage
  const reviewText = review.review_text || '—'
  const rating = review.rating ?? '—'
  const containsSpoilers = review.contains_spoilers === true

  /* =====================================================
     IMAGE HANDLING
     ===================================================== */

  /**
   * Replaces an unavailable user avatar with a placeholder.
   *
   * @param {React.SyntheticEvent<HTMLImageElement>} event
   */
  const handleImageError = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = noImage
  }

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <article className={styles.reviewCard}>

      {/* User information */}
      <div className={styles.author}>
        <img
          src={avatar}
          alt={username}
          className={styles.avatar}
          onError={handleImageError}
          loading="lazy"
        />

        <span className={styles.username}>
          {username}
        </span>
      </div>

      {/* Review content */}
      <div className={styles.reviewSection}>

        <span className={styles.sectionLabel}>
          {t('reviewCard.text')}
        </span>

        <div
          className={`${styles.reviewBody} ${
            containsSpoilers ? styles.spoiler : ''
          }`}
          tabIndex={containsSpoilers ? 0 : undefined}
          role={containsSpoilers ? 'group' : undefined}
          aria-label={
            containsSpoilers
              ? t('reviewCard.spoilerAccessibleLabel')
              : undefined
          }
        >
          <p className={styles.reviewText}>
            {reviewText}
          </p>

          {containsSpoilers && (
            <span className={styles.spoilerNotice}>
              {t('reviewCard.spoilerNotice')}
            </span>
          )}
        </div>

      </div>

      {/* User rating */}
      <div className={styles.rating}>
        <span className={styles.sectionLabel}>
          {t('reviewCard.rating')}
        </span>

        <strong className={styles.ratingValue}>
          {rating !== '—' ? `${rating}/10` : '—'}
        </strong>
      </div>

    </article>
  )
}

/* =====================================================
   PROP TYPES
   ===================================================== */

ReviewCard.propTypes = {
  review: PropTypes.object.isRequired,
}

export default ReviewCard
