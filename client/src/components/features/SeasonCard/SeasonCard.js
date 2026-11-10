
/* =====================================================
   COMPONENTS
   ===================================================== */

import styles from './SeasonCard.module.scss';

import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import noImage from '../../../assets/no-image.png';

/* =====================================================
   SEASON CARD COMPONENT
   ===================================================== */

/**
 * @component
 * @description Displays information about an anime season,
 *              including its cover, title, episode count,
 *              rating and release details.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.season - Season data to display.
 *
 * @returns {JSX.Element} The rendered season card.
 */
const SeasonCard = ({ season }) => {
  const { t } = useTranslation();

  /* =====================================================
     COMPONENT DATA
     ===================================================== */

  // Use a fallback image when the season cover is unavailable.
  const cover = season.season_cover || noImage;


  /**
   * Returns a formatted date in MM.YYYYr. format.
   * Returns an em dash when the date is missing or invalid.
   */
  const formatReleaseDate = (date) => {
    if (!date) return '—'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return '—'
    }

    const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
    const year = parsedDate.getFullYear()

    return `${month}.${year}r.`
  }

  /**
   * Returns a display value or an em dash when the value is empty.
   */
  const getDisplayValue = (value) => {
    return value !== null && value !== undefined && value !== ''
      ? value
      : '—'
  }


  /* =====================================================
     CARD LAYOUT
     ===================================================== */

  return (
    <Col xs="12" sm="6" md="3" lg="2" className="mb-4">
      <div className={styles.card}>

        {/* Season cover */}
        <div
          className={styles.img}
          style={{
            backgroundImage: `url(${cover})`,
          }}
        />

        {/* Season information */}
        <div className={styles.top}>

          <p>
            {t('seasonCard.seasonNumber')}{' '}
            {getDisplayValue(season.season_number)}
          </p>

          <p>
            {t('seasonCard.title')}{' '}
            {getDisplayValue(season.title)}
          </p>

          <p>
            {t('seasonCard.episodesCount')}{' '}
            {getDisplayValue(season.episodes_count)}
          </p>

          <p>
            {t('seasonCard.rating')}{' '}
            {getDisplayValue(season.rating)}
          </p>

          <p>
            {t('seasonCard.year')}{' '}
            {getDisplayValue(season.year)}
          </p>

          <p>
            {t('seasonCard.releaseDate')} 
            {formatReleaseDate(season.release_date)}
          </p>

          <p>
            {t('seasonCard.notes')}{' '}
            {getDisplayValue(season.notes)}
          </p>

        </div>
      </div>
    </Col>
  );
};

/* =====================================================
   PROP TYPES
   ===================================================== */

SeasonCard.propTypes = {
  season: PropTypes.object.isRequired,
};

export default SeasonCard;
