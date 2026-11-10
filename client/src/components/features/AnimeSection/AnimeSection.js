
/* =====================================================
   ANIME SECTION
   ===================================================== */

/**
 * @file AnimeSection.js
 * @description Displays a horizontal, responsive anime carousel
 *              with navigation arrows and loading skeletons.
 */

import styles from './AnimeSection.module.scss'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import AnimeCard from '../AnimeCard/AnimeCard'
import SkeletonAnimeCard from '../AnimeCard/SkeletonAnimeCard'
import Button from '../../common/Button/Button'

/* =====================================================
   ANIME SECTION COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders an anime carousel with responsive slide settings.
 *
 * @param {string} props.title - Section heading.
 * @param {Array} props.animes - List of anime objects.
 */
const AnimeSection = ({ title, animes }) => {
  const { t } = useTranslation()

  /* =====================================================
     SWIPER STATE
     ===================================================== */

  const [swiperInstance, setSwiperInstance] = useState(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  /* =====================================================
     LOADING STATE
     ===================================================== */

  /**
   * Displays skeleton cards when no anime data is available.
   * Note: An empty array is treated as a loading state here,
   * preserving the original component behavior.
   */
  const isLoading = !animes?.length

  const displayedAnimes = isLoading
    ? Array.from({ length: 8 }, (_, index) => index)
    : animes

  /* =====================================================
     NAVIGATION HANDLING
     ===================================================== */

  /**
   * Updates navigation arrow visibility according to
   * the current Swiper position.
   *
   * @param {Object} swiper - Swiper instance.
   */
  const updateNavigation = (swiper) => {
    if (!swiper || swiper.destroyed) return

    setCanScrollLeft(!swiper.isBeginning)
    setCanScrollRight(!swiper.isEnd)
  }

  /**
   * Moves the carousel by one slide.
   *
   * @param {'left'|'right'} direction - Navigation direction.
   */
  const scrollSlider = (direction) => {
    if (!swiperInstance || swiperInstance.destroyed) return

    if (direction === 'left') {
      swiperInstance.slidePrev()
    } else {
      swiperInstance.slideNext()
    }
  }

  /* =====================================================
     COMPONENT RENDERING
     ===================================================== */

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.sliderWrapper}>
        {/* PREVIOUS SLIDE BUTTON */}
        {canScrollLeft && !isLoading && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={() => scrollSlider('left')}
            aria-label={t('animeSection.btnLariaLabel')}
          >
            &#10094;
          </button>
        )}

        {/* ANIME CAROUSEL */}
        <Swiper
          className={styles.slider}
          spaceBetween={16}
          slidesPerView={4}
          slidesPerGroup={1}
          watchOverflow
          grabCursor
          onSwiper={(swiper) => {
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
            900: {
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

        {/* NEXT SLIDE BUTTON */}
        {canScrollRight && !isLoading && (
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

      {/* SHOW MORE BUTTON */}
      <Button to="/">
        {t('common.showMore')}
      </Button>
    </section>
  )
}

/* =====================================================
   PROP TYPES
   ===================================================== */

AnimeSection.propTypes = {
  title: PropTypes.string.isRequired,
  animes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default AnimeSection
