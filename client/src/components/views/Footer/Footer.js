
import styles from './Footer.module.scss';

import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  /* =====================================================
     CURRENT YEAR
     ===================================================== */

  const currentYear = new Date().getFullYear();

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <footer className={styles.root}>
      <div className={styles.text}>
        <p>
          Copyright &copy; Anime Favorite {currentYear}.{' '}
          {t('footer.createdBy')}{' '}

          <a
            href="https://karol-bernatowicz-portfolio.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            title={t('footer.portfolioTitle')}
            aria-label={t('footer.portfolioTitle')}
          >
            Karol Bernatowicz
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
