/**
 * @file WrongPage.js
 * @description Displays a 404 error page when the user
 * navigates to a non-existent route.
 */

// Styles
import styles from './WrongPage.module.scss';

// Layout components
import { Col } from 'react-bootstrap';
import Container from '../../common/container/Container';

// UI components
import Button from '../../common/Button/Button';

// Translations
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <Container>
        <h1>404</h1>
        <h4>{t('wrongPage.title')}</h4>

        <Col xs="12" className="d-flex justify-content-center my-3">
          <Button to="/">
            {t('wrongPage.backToHome')}
          </Button>
        </Col>
      </Container>
    </div>
  );
};

export default WrongPage;
