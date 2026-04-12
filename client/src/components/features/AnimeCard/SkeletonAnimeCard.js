import styles from './SkeletonAnimeCard.module.scss';
import { Col } from 'react-bootstrap'

const SkeletonAnimeCard = () => {
  return (
    <Col xs="12" sm="6" md="4" lg="3" className="mb-4">
      
      <div className={styles.loader} id="loader">
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
          <div  className={styles.loadercircle}></div>
        </div>
      </div>
    </Col>
  );
};

export default SkeletonAnimeCard;