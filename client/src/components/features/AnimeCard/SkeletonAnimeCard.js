
/* =====================================================
   Skeleton Anime Card
   ===================================================== */

/**
 * @file SkeletonAnimeCard.js
 * @description Displays an animated loading indicator while anime cards are being fetched.
 */

import styles from './SkeletonAnimeCard.module.scss'

/* =====================================================
   COMPONENT
   ===================================================== */

/**
 * Renders an animated loading indicator.
 *
 * @returns {JSX.Element} Animated loading indicator.
 */
const SkeletonAnimeCard = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.loaderwrapper}>
        <span className={styles.loaderletter}>.</span>
        <span className={styles.loaderletter}>.</span>
        <span className={styles.loaderletter}>.</span>
        <span className={styles.loaderletter}>L</span>
        <span className={styles.loaderletter}>o</span>
        <span className={styles.loaderletter}>a</span>
        <span className={styles.loaderletter}>d</span>
        <span className={styles.loaderletter}>i</span>
        <span className={styles.loaderletter}>n</span>
        <span className={styles.loaderletter}>g</span>
        <span className={styles.loaderletter}>.</span>
        <span className={styles.loaderletter}>.</span>
        <span className={styles.loaderletter}>.</span>
        <div className={styles.loadercircle} />
      </div>
    </div>
  )
}

export default SkeletonAnimeCard
