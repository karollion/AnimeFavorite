
/* =====================================================
   SEASON SECTION
   ===================================================== */

/**
 * @file SeasonSection.js
 * @description Displays a responsive season carousel
 *              with navigation arrows.
 */

/* =====================================================
   STYLES
   ===================================================== */

import styles from './SeasonSection.module.scss'

/* =====================================================
   DEPENDENCIES
   ===================================================== */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

/* =====================================================
   COMPONENTS
   ===================================================== */

import SeasonCard from '../SeasonCard/SeasonCard'

/* =====================================================
   SEASON SECTION COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders a horizontal carousel of season cards.
 *
 * @param {string} props.title - Section heading.
 * @param {Array} props.seasons - List of season objects.
 */
const SeasonSection = ({ title, seasons }) => {
  const { t } = useTranslation()

  /* =====================================================
     SWIPER STATE
     ===================================================== */

  const [swiperInstance, setSwiperInstance] = useState(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

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

  if (!seasons.length) {
    return null
  }

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.sliderWrapper}>
        {/* PREVIOUS SLIDE BUTTON */}
        {canScrollLeft && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={() => scrollSlider('left')}
            aria-label={t('seasonSection.btnLariaLabel')}
          >
            &#10094;
          </button>
        )}

        {/* SEASON CAROUSEL */}
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
              slidesPerView: 2,
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
          {seasons.map((season) => (
            <SwiperSlide
              key={season._id}
              className={styles.slide}
            >
              <SeasonCard season={season} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* NEXT SLIDE BUTTON */}
        {canScrollRight && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={() => scrollSlider('right')}
            aria-label={t('seasonSection.btnRariaLabel')}
          >
            &#10095;
          </button>
        )}
      </div>
    </section>
  )
}

/* =====================================================
   PROP TYPES
   ===================================================== */

SeasonSection.propTypes = {
  title: PropTypes.string.isRequired,
  seasons: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default SeasonSection
