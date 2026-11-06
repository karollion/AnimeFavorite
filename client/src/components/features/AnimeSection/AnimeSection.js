
import styles from './AnimeSection.module.scss'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import AnimeCard from '../AnimeCard/AnimeCard'
import SkeletonAnimeCard from '../AnimeCard/SkeletonAnimeCard'
import Button from '../../common/Button/Button'
import { useTranslation } from 'react-i18next'

const AnimeSection = ({ title, animes }) => {
  const { t } = useTranslation()

  const [swiperInstance, setSwiperInstance] = useState(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const isLoading = !animes?.length

  /*
   * Displays skeleton cards while the anime list is loading.
   */
  const displayedAnimes = isLoading
    ? Array.from({ length: 8 }, (_, index) => index)
    : animes

  /*
   * Updates the navigation arrows according to the current
   * Swiper position.
   */
  const updateNavigation = swiper => {
    if (!swiper || swiper.destroyed) return

    setCanScrollLeft(!swiper.isBeginning)
    setCanScrollRight(!swiper.isEnd)
  }

  /*
   * Moves the slider by exactly one card.
   */
  const scrollSlider = direction => {
    if (!swiperInstance || swiperInstance.destroyed) return

    if (direction === 'left') {
      swiperInstance.slidePrev()
    } else {
      swiperInstance.slideNext()
    }
  }

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.sliderWrapper}>
        {canScrollLeft && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={() => scrollSlider('left')}
            aria-label={t('animeSection.btnLariaLabel')}
          >
            &#10094;
          </button>
        )}

        <Swiper
          className={styles.slider}
          spaceBetween={16}
          slidesPerView={4}
          slidesPerGroup={1}
          watchOverflow={true}
          grabCursor={true}
          onSwiper={swiper => {
            setSwiperInstance(swiper)
            updateNavigation(swiper)
          }}
          onSlideChange={updateNavigation}
          onResize={updateNavigation}
          onUpdate={updateNavigation}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 12,
            },
            576: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
          }}
        >
          {displayedAnimes.map((anime, index) => (
            <SwiperSlide
              key={isLoading ? `skeleton-${index}` : anime._id}
              className={styles.slide}
            >
              {isLoading ? (
                <SkeletonAnimeCard />
              ) : (
                <AnimeCard anime={anime} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {canScrollRight && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={() => scrollSlider('right')}
            aria-label={t('animeSection.btnRariaLabel')}
          >
            &#10095;
          </button>
        )}
      </div>

      <Button to="/">{t('common.showMore')}</Button>
    </section>
  )
}

AnimeSection.propTypes = {
  title: PropTypes.string.isRequired,
  animes: PropTypes.array.isRequired,
}

export default AnimeSection
