
/* =====================================================
   Add Anime Page
   ===================================================== */

/**
 * @file AddAnime.js
 * @description Page component for adding a new anime entity.
 *              Provides a page layout with a heading and the reusable
 *              AnimeForm component for entering anime data.
 */

/* =====================================================
   COMPONENTS
   ===================================================== */

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './AddAnime.module.scss';
import AnimeForm from '../../features/AnimeForm/AnimeForm';
import Container from '../../common/container/Container';
import { addAnimeRequest } from '../../../redux/reducers/animesRedux';
import { useMessage } from '../../../context/MessageContext';

/* =====================================================
   ADD ANIME COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders the page for creating a new anime entry.
 *              Uses the shared AnimeForm component to handle anime data input.
 *
 * @returns {JSX.Element} The add anime page.
 */
const AddAnime = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showMessage } = useMessage();

  const [isSaving, setIsSaving] = useState(false);

  /* =====================================================
     ADD ANIME HANDLER
     ===================================================== */

  /**
   * Creates a new anime entry.
   * Displays a success or error message depending on the result.
   *
   * @param {Object} data - Anime form data.
   */
  const handleAddAnime = async (data) => {
    setIsSaving(true);

    try {
      const createdAnime = await dispatch(
        addAnimeRequest(data)
      );

      await showMessage({
        title: t('common.success'),
        message: t('addAnime.saveSuccess'),
        mode: 'alert',
        confirmText: t('common.ok'),
      });

      navigate(`/anime/${createdAnime.slug}`);

    } catch (err) {
      await showMessage({
        title: t('common.error'),
        message:
          err.response?.data?.message ||
          t('addAnime.saveFailed'),
        mode: 'alert',
        confirmText: t('common.ok'),
      });

    } finally {
      setIsSaving(false);
    }
  };

  /* =====================================================
     PAGE LAYOUT
     ===================================================== */

  return (
    <div className={styles.root}>
      <Container>
        <h1>{t('addAnime.title')}</h1>

        <AnimeForm
          onSubmit={handleAddAnime}
          submitText={t('addAnime.submit')}
          isSaving={isSaving}
        />
      </Container>
    </div>
  );
};

export default AddAnime;
