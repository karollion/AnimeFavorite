import styles from './StatsList.module.scss';
import StatCard from '../StatCard/StatCard';
import PropTypes from 'prop-types'
import SkeletonCard from '../StatCard/SkeletonCard';

const StatsList = ({ stats = [] }) => {

  if (!stats.length) {
    return (
      <div className={styles.root}>
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {stats.map(anime => (
        <StatCard key={anime._id} anime={anime} />
      ))}
    </div>
  );
};

StatsList.propTypes = {
  stats: PropTypes.array,
};

export default StatsList;