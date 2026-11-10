
/* =====================================================
   COMPONENTS
   ===================================================== */

import styles from './StatCard.module.scss';

/* =====================================================
   SKELETON CARD COMPONENT
   ===================================================== */

/**
 * @component
 * @description Displays a loading placeholder for an anime statistics card.
 *              Uses a pulsing animation to indicate that content is loading.
 *
 * @returns {JSX.Element} The rendered skeleton card.
 */
const SkeletonCard = () => {
  return (
    <div className={styles.card}>

      {/* Animated placeholder representing the anime card content */}
      <div
        style={{
          height: '110px',
          background: '#2a2a2a',
          borderRadius: '12px',
          animation: 'pulse 1.5s infinite',
        }}
      />

    </div>
  );
};

export default SkeletonCard;
