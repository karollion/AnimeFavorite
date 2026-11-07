
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
import CharacterCard from '../../features/CharacterCard/CharacterCard'

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
          <h1>{t('profile.title')}</h1>
          <p>{t('profile.loginRequired')}</p>
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

  const favoriteCharacters = user.favorite_characters || []

  return (
    <div className={styles.root}>
      <Container>

        {/* Main page heading */}
        <h1 className={styles.title}>
          {t('profile.title')}
        </h1>

        {/* User avatar and personal information */}
        <div className={styles.about}>

          {/* User avatar with a fallback image */}
          <img
            src={user.avatar || noImage}
            alt={t('profile.avatarAlt', {
              login: user.login || '',
            })}
            className={styles.img}
            onError={handleImageError}
          />

          <div>

            {/* Navigation to the profile editing page */}
            <Button to="/ProfileEdit">
              {t('common.edit')}
            </Button>

            {/* Basic account information */}
            <p>
              {t('profile.login')} {user.login || t('profile.notSpecified')}
            </p>

            <p>
              {t('profile.role')} {role}
            </p>

            <p>
              {t('profile.email')} {user.email || t('profile.notSpecified')}
            </p>

            <p>
              {t('profile.birthYear')} {birthYear}
            </p>

            <p>
              {t('profile.description')} {description}
            </p>

          </div>
        </div>

        {/* Favorite characters section */}
        <section className={styles.favoriteSection}>

          <h2>
            {t('profile.favoriteCharacters')}
          </h2>

          {favoriteCharacters.length > 0 ? (
            <div className={styles.characters}>
              {favoriteCharacters.map(character => (
                <div key={character._id}>
                  <CharacterCard character={character} />
                </div>
              ))}
            </div>
          ) : (
            <p>
              {t('profile.noFavoriteCharacters')}
            </p>
          )}

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
