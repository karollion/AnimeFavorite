/* =====================================================
   Wrong Page
   ===================================================== */

/**
 * @file WrongPage.js
 * @description Displays a 404 error page when the user
 * navigates to a non-existent route.
 */

// Styles
import styles from './WrongPage.module.scss'

// Layout components
import { Col } from 'react-bootstrap'
import Container from '../../common/container/Container'

// UI components
import Button from '../../common/Button/Button'

/**
 * WrongPage component.
 *
 * Renders a 404 error message and provides a button
 * that allows the user to return to the home page.
 *
 * @component
 * @returns {JSX.Element} The 404 error page.
 */
const WrongPage = () => {

  return (
    <div className={styles.root}>
      <Container>
        {/* Display the HTTP 404 error code and message */}
        <h1>404</h1>
        <h4>Oh no!</h4>

        {/* Provide navigation back to the home page */}
        <Col xs="12" className="d-flex justify-content-center my-3">
          <Button to="/">Back to home</Button>
        </Col>
      </Container>
    </div>
  );
};

export default WrongPage;