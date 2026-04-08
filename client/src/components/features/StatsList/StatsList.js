import styles from './StatsList.module.scss';
import StatCard from '../StatCard/StatCard';
import PropTypes from 'prop-types'


const StatsList = ({ stats }) => {
  
  return (
    <div className={styles.root}>
      {stats?.map(anime => (
        <StatCard
          key={anime._id}
          anime={anime}
        />
      ))}
    </div>
  );
};

StatsList.propTypes = {
  stats: PropTypes.array.isRequired,
};

export default StatsList;