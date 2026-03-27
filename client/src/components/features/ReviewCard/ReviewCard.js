import styles from './ReviewCard.module.scss'
import { Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import noImage from '../../../assets/no-image.png'

const ReviewCard = ({ review }) => {
  return (
    <Col xs="12" sm="6" md="3" lg="2" className="mb-4">
      <div className={styles.card}>
        <div
          className={styles.img}
          style={{
            backgroundImage: `url(${review.user.avatar || noImage})`,
          }}
        >
      </div>
        <div className={styles.top}>
        <p>{"User: " + review.user.login}</p>
          <p>{"Rating given by the user: " + review.rating}</p>
          <p>{"Text: " + review.review_text}</p>
          <p>{"contains_spoilers: " + review.contains_spoilers}</p>
        </div>
      </div>
    </Col>
  )
}

ReviewCard.propTypes = {
  review: PropTypes.object.isRequired,
}

export default ReviewCard;