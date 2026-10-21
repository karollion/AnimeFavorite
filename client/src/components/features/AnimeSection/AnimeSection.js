
import styles from './AnimeSection.module.scss'
import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import AnimeCard from '../AnimeCard/AnimeCard'
import SkeletonAnimeCard from '../AnimeCard/SkeletonAnimeCard'
import Button from '../../common/Button/Button'

const AnimeSection = ({ title, animes }) => {
  const sliderRef = useRef(null)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  /*
   * Sprawdza, czy lista kart może zostać przesunięta
   * w lewo lub w prawo. Dzięki temu strzałki pojawiają się
   * tylko wtedy, gdy rzeczywiście można przewijać zawartość.
   */
  useEffect(() => {
    const slider = sliderRef.current

    if (!slider) return

    const updateArrows = () => {
      setCanScrollLeft(slider.scrollLeft > 1)

      setCanScrollRight(
        slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 1
      )
    }

    updateArrows()

    slider.addEventListener('scroll', updateArrows)
    window.addEventListener('resize', updateArrows)

    const resizeObserver = new ResizeObserver(updateArrows)
    resizeObserver.observe(slider)

    return () => {
      slider.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
      resizeObserver.disconnect()
    }
  }, [animes?.length])

  /*
   * Przesuwa slider o większość jego widocznej szerokości,
   * dzięki czemu użytkownik może wygodnie przeglądać kolejne karty.
   */

  const scrollSlider = direction => {
    const slider = sliderRef.current
  
    if (!slider) return
  
    const firstSlide = slider.querySelector(`.${styles.slide}`)
  
    if (!firstSlide) return
  
    const slideWidth = firstSlide.getBoundingClientRect().width
    const track = slider.querySelector(`.${styles.track}`)
    const trackStyles = window.getComputedStyle(track)
    const gap = parseFloat(trackStyles.columnGap) || 0
  
    slider.scrollBy({
      left: direction * (slideWidth + gap),
      behavior: 'smooth',
    })
  }


  const isLoading = !animes?.length

  const displayedAnimes = isLoading
    ? Array.from({ length: 10 }, (_, i) => i)
    : animes

  return (
    <section className={styles.root}>
      <h2>{title}</h2>

      <div className={styles.sliderWrapper}>
        {canScrollLeft && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={() => scrollSlider(-1)}
            aria-label="Poprzednie anime"
          >
            &#10094;
          </button>
        )}

        <div className={styles.slider} ref={sliderRef}>
          <div className={styles.track}>
            {displayedAnimes.map((anime, index) => (
              <div
                className={styles.slide}
                key={isLoading ? `skeleton-${index}` : anime._id}
              >
                {isLoading ? (
                  <SkeletonAnimeCard />
                ) : (
                  <AnimeCard anime={anime} />
                )}
              </div>
            ))}
          </div>
        </div>

        {canScrollRight && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={() => scrollSlider(1)}
            aria-label="Następne anime"
          >
            &#10095;
          </button>
        )}
      </div>

      <Button to="/">Show more</Button>
    </section>
  )
}

AnimeSection.propTypes = {
  title: PropTypes.string.isRequired,
  animes: PropTypes.array.isRequired,
}

export default AnimeSection
