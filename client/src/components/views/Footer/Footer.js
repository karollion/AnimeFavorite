import styles from './Footer.module.scss';
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()
  
  function getDate() {
    const today = new Date();
    const year = today.getFullYear();
    return `${year}`;
  }

    return (
      <div className={styles.root}>
        <div className={styles.vaves}></div> 
        <div className={styles.text}>
          <p>
            Copyright &copy; Anime Favorite {getDate()}.  {t('footer.createdBy')} 
            <a href='https://karol-bernatowicz-portfolio.onrender.com/'  target="_blank" title="Karol Bernatowicz home page"  rel="noreferrer">  Karol Bernatowicz</a>
          </p>
        </div>
      </div>
    );
};

export default Footer;