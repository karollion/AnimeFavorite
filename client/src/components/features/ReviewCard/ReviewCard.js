
/**
 * @file ReviewCard.js
 * @description Displays a user's review, including their avatar,
 * login, rating, review text, and spoiler information.
 */

import styles from './ReviewCard.module.scss'

/* =====================================================
   LIBRARIES
   ===================================================== */

import { Col } from 'react-bootstrap'
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
 * Displays a single user review.
 *
 * @param {Object} props
 * @param {Object} props.review - Review data.
 * @returns {JSX.Element}
 */
const ReviewCard = ({ review }) => {
  const { t } = useTranslation()

  /**
   * Returns a display value or an em dash when the value is empty.
   *
   * @param {*} value
   * @returns {string|number}
   */
  const getDisplayValue = (value) => {
    return value !== null && value !== undefined && value !== ''
      ? value
      : '—'
  }

  return (
    <Col xs="12" sm="6" md="3" lg="2" className="mb-4">
      <div className={styles.card}>
        <div
          className={styles.img}
          style={{
            backgroundImage: `url(${review.user?.avatar || noImage})`,
          }}
        />

        <div className={styles.top}>
          <p>
            {t('reviewCard.user')} {getDisplayValue(review.user?.login)}
          </p>

          <p>
            {t('reviewCard.rating')} {getDisplayValue(review.rating)}
          </p>

          <p>
            {t('reviewCard.text')} {getDisplayValue(review.review_text)}
          </p>

          <p>
            {t('reviewCard.containsSpoilers')}{' '}
            {review.contains_spoilers
              ? t('reviewCard.yes')
              : t('reviewCard.no')}
          </p>
        </div>
      </div>
    </Col>
  )
}

/* =====================================================
   PROP TYPES
   ===================================================== */

ReviewCard.propTypes = {
  review: PropTypes.object.isRequired,
}

export default ReviewCard
