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

import styles from './AddAnime.module.scss';
import AnimeForm from '../../features/AnimeForm/AnimeForm';
import Container from '../../common/container/Container';
import { addAnimeRequest } from '../../../redux/reducers/animesRedux';

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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleAddAnime = async ( data ) => {
    //console.log(data)
    setIsSaving(true);
    setError('');

    try {
      const createdAnime = await dispatch(
        addAnimeRequest( data )
      );

      navigate(`/anime/${createdAnime.slug}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to add anime.'
      );
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
        <h1>Add new anime</h1>

        {error && <p className="text-danger">{error}</p>}

        <AnimeForm
          onSubmit={handleAddAnime}
          submitText="Add anime"
          isSaving={isSaving}
        />
      </Container>
    </div>
  )
}

export default AddAnime