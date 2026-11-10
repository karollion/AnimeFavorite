
/* =====================================================
   CHARACTER CARD
   ===================================================== */

/**
 * @file CharacterCard.js
 * @description Displays a character card with basic information
 *              and a link to the character details page.
 */

import styles from './CharacterCard.module.scss'

import { Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import noImage from '../../../assets/no-image.png'

/* =====================================================
   CHARACTER CARD COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders a character's image and basic information.
 *
 * @param {Object} props.character - Character data.
 */
const CharacterCard = ({ character }) => {
  const { t } = useTranslation()

  /* =====================================================
     DISPLAY VALUES
     ===================================================== */

  /**
   * Translates character role and gender values.
   * Falls back to the original value if no translation exists.
   */
  const role = character.role
    ? t(`characterCard.roles.${character.role}`, {
        defaultValue: character.role,
      })
    : '—'

  /* =====================================================
     COMPONENT RENDERING
     ===================================================== */

  return (
    <Col xs="12" sm="6" md="3" lg="2" className="mb-4">
      <div className={styles.card}>
        {/* CHARACTER IMAGE */}
        <div
          className={styles.img}
          role="img"
          aria-label={t('characterCard.imageAlt', {
            name: character.firstName,
          })}
          style={{
            backgroundImage: `url(${character.photo || noImage})`,
          }}
        />

        {/* CHARACTER INFORMATION */}
        <div className={styles.top}>
          <p>{character.firstName || '—'}</p>
          <p>{role}</p>
        </div>
      </div>

      {/* CHARACTER DETAILS LINK */}
      <Link
        to={`/character/${character._id}`}
        className={styles.btn}
      >
        {character.firstName || t('characterCard.details')}
      </Link>
    </Col>
  )
}

/* =====================================================
   PROP TYPES
   ===================================================== */

CharacterCard.propTypes = {
  character: PropTypes.object.isRequired,
}

export default CharacterCard
