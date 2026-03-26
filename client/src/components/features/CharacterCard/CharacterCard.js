import styles from './CharacterCard.module.scss'
import { Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import noImage from '../../../assets/no-image.png'

const CharacterCard = ({ character }) => {
  return (
    <Col xs="12" sm="6" md="3" lg="2" className="mb-4">
      <div
        className={styles.card}
        
      >
        <div
        className={styles.img}
        style={{
          backgroundImage: `url(${character.photo || noImage})`,
        }}
      ></div>
        <div className={styles.top}>
          <p>{character.firstName}</p>
          <p>{character.lastName}</p>
          <p>{character.role}</p>
          <p>{character.age}</p>
          <p>{character.gender}</p>
          <p>{character.species}</p>
          <p>{character.originWorld}</p>
          <p>{character.description}</p>
        </div>
      </div>
    </Col>
  )
}

CharacterCard.propTypes = {
  anime: PropTypes.object.isRequired,
}

export default CharacterCard;