/**
 * @file Home.js
 * @description Main page component of the application.
 *              Fetches home page data through Redux and displays anime
 *              collections grouped by category.
 */

// Styles
import styles from './Home.module.scss'

// React
import { useEffect } from 'react'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { fetchHome } from '../../../redux/reducers/homeSliceRedux'

// Translations and messages
import { useTranslation } from 'react-i18next'
import { useMessage } from '../../../context/MessageContext'

// UI components
import AnimeSection from '../../features/AnimeSection/AnimeSection'
import Container from '../../common/container/Container'

const Home = () => {
  const { t } = useTranslation()
  const { showMessage } = useMessage()

  const dispatch = useDispatch()

  // Home page data and request status from Redux.
  const {
    newest,
    topRated,
    films,
    tvSeries,
    random,
    loading,
    error,
  } = useSelector(state => state.home)

  /**
   * Fetches home page collections when the component mounts.
   */
  useEffect(() => {
    dispatch(fetchHome())
  }, [dispatch])

  /**
   * Displays an error message when the home page request fails.
   * The Redux error state prevents duplicate notifications.
   */
  useEffect(() => {
    if (!error) return

    showMessage({
      title: t('common.error'),
      message: t('homePage.loadError'),
      mode: 'alert',
      confirmText: t('common.ok'),
    })
  }, [error, showMessage, t])

  // Display a loading message while the initial request is pending.
  if (loading) {
    return (
      <div className={styles.root}>
        <Container>
          <p>{t('common.loading')}</p>
        </Container>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <Container>

        {/* Newest anime releases */}
        <AnimeSection
          title={t('homePage.newAnimes')}
          animes={newest}
        />

        {/* Highest-rated anime */}
        <AnimeSection
          title={t('homePage.topRated')}
          animes={topRated}
        />

        {/* Random anime selection */}
        <AnimeSection
          title={t('homePage.random')}
          animes={random}
        />

        {/* Anime movies */}
        <AnimeSection
          title={t('homePage.movies')}
          animes={films}
        />

        {/* Anime TV series */}
        <AnimeSection
          title={t('homePage.tvSeries')}
          animes={tvSeries}
        />

      </Container>
      
      <section>
        <p>!!! Dokonczyć tłumaczenia wszystkich stron, i przerabianie motywów wszsystkich scss !!!</p>
        <p>!!! Zrobic podstrony do sekcji w home po kliknieciu pokaz wiecej !!!</p>
        <p>!!! Sprawdzic rewiew i season rating i ich powiazania , chyba trzeba dodac rating sezonu!!!</p>
        <p>!!! Usuwanie anime, dodawanie sezonów</p>
        <p>!!! dodanie okienek gdzie trzeba</p>
      </section>
    </div>
  )
}

export default Home

