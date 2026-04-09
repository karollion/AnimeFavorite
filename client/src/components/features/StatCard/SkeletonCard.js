import styles from './StatCard.module.scss';

const SkeletonCard = () => {
  return (
    <div className={styles.card}>
      <div
        style={{
          height: '200px',
          background: '#2a2a2a',
          borderRadius: '12px',
          animation: 'pulse 1.5s infinite',
        }}
      />
    </div>
  );
};

export default SkeletonCard;