
/* =====================================================
   CHARACTER CARD
   ===================================================== */

/**
 * @file CharacterCard.js
 * @description Displays a character card with an image, role,
 *              name and a link to the character details page.
 */

import styles from './CharacterCard.module.scss'

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import noImage from '../../../assets/no-image.png'

/* =====================================================
   CHARACTER CARD COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders a clickable character card.
 *
 * @param {Object} props.character - Character data.
 */
const CharacterCard = ({ character }) => {
  const { t } = useTranslation()

  /* =====================================================
     DISPLAY VALUES
     ===================================================== */

  const firstName = character.firstName || ''
  const lastName = character.lastName || ''

  const fullName = `${firstName} ${lastName}`.trim() || '—'

  /**
   * Translates the character role.
   * Falls back to the original value if no translation exists.
   */
  const role = character.role
    ? t(`characterCard.roles.${character.role}`, {
        defaultValue: character.role,
      })
    : '—'

  /* =====================================================
     IMAGE HANDLING
     ===================================================== */

  /**
   * Replaces the character image with a fallback
   * if the original image cannot be loaded.
   *
   * @param {Event} event - Image error event.
   */
  const handleImageError = (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = noImage
  }

  /* =====================================================
     COMPONENT RENDERING
     ===================================================== */

  return (
    <Link
      to={`/character/${character._id}`}
      className={styles.cardLink}
      aria-label={t('characterCard.openCharacter', {
        name: fullName,
      })}
    >
      <article className={styles.card}>
        {/* CHARACTER IMAGE */}
        <div className={styles.imageWrapper}>
          <img
            src={character.photo || noImage}
            alt={t('characterCard.imageAlt', {
              name: fullName,
            })}
            className={styles.image}
            onError={handleImageError}
            loading="lazy"
          />
        </div>

        {/* CHARACTER ROLE */}
        <p className={styles.role}>{role}</p>

        {/* CHARACTER NAME */}
        <h3 className={styles.name}>{fullName}</h3>
      </article>
    </Link>
  )
}

/* =====================================================
   PROP TYPES
   ===================================================== */

CharacterCard.propTypes = {
  character: PropTypes.object.isRequired,
}

export default CharacterCard
