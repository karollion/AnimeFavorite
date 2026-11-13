/**
 * @file Profile.js
 * @description Page component for displaying the authenticated user's profile.
 *              Displays personal information, avatar, and favorite characters.
 */

// Styles
import styles from './Profile.module.scss'

// React and translations
import { useTranslation } from 'react-i18next'

// Redux
import { useSelector } from 'react-redux'
import { getUser } from '../../../redux/reducers/userRedux'

// UI components
import { Col } from 'react-bootstrap'
import Container from '../../common/container/Container'
import Button from '../../common/Button/Button'
import CharacterSection from '../../features/CharacterSection/CharacterSection'

// Assets
import noImage from '../../../assets/no-image.png'

const Profile = () => {
  const { t } = useTranslation()

  // Currently authenticated user's profile data.
  const user = useSelector(getUser)

  /**
   * Replaces a failed avatar image with the default fallback.
   * Disables the error handler to prevent an infinite retry loop.
   *
   * @param {Event} event - Image error event.
   */
  const handleImageError = event => {
    event.currentTarget.onerror = null
    event.currentTarget.src = noImage
  }

  // Authentication guard.
  if (!user) {
    return (
      <div className={styles.root}>
        <Container>
          <h1 className={styles.title}>{t('profile.title')}</h1>
          <p className={styles.loginRequired}>
            {t('profile.loginRequired')}
          </p>
        </Container>
      </div>
    )
  }

  // Prepare profile values with translated fallbacks.
  const role = t(`profile.roles.${user.role}`, {
    defaultValue: user.role || t('profile.notSpecified'),
  })

  const birthYear = user.birth_year ?? t('profile.notSpecified')

  const description = user.description?.trim()
    ? user.description
    : t('profile.notSpecified')

  return (
    <div className={styles.root}>
      <Container>

        {/* Main page heading */}
        <h1 className={styles.title}>
          {t('profile.title')}
        </h1>

        {/* User profile information */}
        <section className={styles.about}>

          {/* User avatar */}
          <div className={styles.avatarWrapper}>
            <img
              src={user.avatar || noImage}
              alt={t('profile.avatarAlt', {
                login: user.login || '',
              })}
              className={styles.img}
              onError={handleImageError}
            />
          </div>

          {/* Personal information */}
          <div className={styles.profileInfo}>

            <h2 className={styles.username}>
              {user.login || t('profile.notSpecified')}
            </h2>

            <div className={styles.infoList}>
              <p className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  {t('profile.role')}
                </span>
                <span>{role}</span>
              </p>

              <p className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  {t('profile.email')}
                </span>
                <span>{user.email || t('profile.notSpecified')}</span>
              </p>

              <p className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  {t('profile.birthYear')}
                </span>
                <span>{birthYear}</span>
              </p>

              <div className={`${styles.infoItem} ${styles.descriptionItem}`}>
                <span className={styles.infoLabel}>
                  {t('profile.description')}
                </span>
                <p>{description}</p>
              </div>
            </div>

            {/* Navigation to the profile editing page */}
            <div className={styles.editButton}>
              <Button to="/ProfileEdit">
                {t('common.edit')}
              </Button>
            </div>

          </div>
        </section>

        {/* Favorite characters section */}
        <section className={styles.favoriteSection}>
          <CharacterSection
            title={t('profile.favoriteCharacters')}
            characters={user.favorite_characters || []}
          />
        </section>

        {/* Navigation back to the home page */}
        <Col xs="12" className="d-flex justify-content-center my-3">
          <Button to="/">
            {t('common.home')}
          </Button>
        </Col>

      </Container>
    </div>
  )
}

export default Profile