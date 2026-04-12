import styles from './SkeletonAnimeCard.module.scss';
import { Col } from 'react-bootstrap'

const SkeletonAnimeCard = () => {
  return (
    <Col xs="12" sm="6" md="4" lg="3" className="mb-4">
      <div className={styles.card}>
        Loadnig
      </div>
    </Col>
  );
};

export default SkeletonAnimeCard;