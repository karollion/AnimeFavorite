/* =====================================================
   Edit Anime Page
   ===================================================== */

/**
 * @file EditAnime.js
 * @description Page component for editing an existing anime entity.
 *              Fetches anime data by slug and displays its title together
 *              with the reusable AnimeForm component pre-filled with
 *              the selected anime's data.
 */

import styles from './EditAnime.module.scss'

/* =====================================================
   ROUTING AND REACT HOOKS
   ===================================================== */

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';

/* =====================================================
   REDUX STATE MANAGEMENT
   ===================================================== */

import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAnimeBySlug,
  getSelectedAnime,
  getAnimesLoading,
  getAnimesError,
  updateAnimeRequest,
  updateAnimeCoverRequest,
} from '../../../redux/reducers/animesRedux';

/* =====================================================
   COMPONENTS
   ===================================================== */

import AnimeForm from '../../features/AnimeForm/AnimeForm'
import Container from '../../common/container/Container'
import AnimeCoverUpload from '../../features/AnimeForm/AnimeCoverUpload';

/* =====================================================
   EDIT ANIME COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders the page for editing an existing anime entry.
 *              Retrieves the anime slug from the URL, fetches the
 *              corresponding anime data through Redux, and passes the
 *              selected anime to AnimeForm for editing.
 *
 * @returns {JSX.Element} The edit anime page.
 */
const EditAnime = () => {
   const [isSaving, setIsSaving] = useState(false);
   const [saveError, setSaveError] = useState('');


   const { slug } = useParams()
   const dispatch = useDispatch()

   const loading = useSelector(getAnimesLoading)
   const anime = useSelector(getSelectedAnime)
   const error = useSelector(getAnimesError)

   /* =====================================================
      DATA FETCHING
      ===================================================== */

   /**
    * Fetches anime details whenever the URL slug changes.
    * Skips the request if no slug is available.
    *
    * @dependency dispatch - Redux dispatch function.
    * @dependency slug - Identifier of the anime to be edited.
    */
   useEffect(() => {
     if (!slug) return
     dispatch(fetchAnimeBySlug(slug))
   }, [dispatch, slug])

   /* =====================================================
      LOADING AND ERROR HANDLING
      ===================================================== */

   if (loading) return <p>Loading...</p>;

   if (error) return <p>Error: {error}</p>;

   if (!anime) return <p>Anime not found.</p>;

   const handleEditAnime = async (data, cover) => {
      setIsSaving(true);
      setSaveError('');

      try {
        await dispatch(updateAnimeRequest({
          ...data,
          _id: anime._id,
        }));

        if (cover) {
          await dispatch(updateAnimeCoverRequest(anime._id, cover));
        }

        // Ponownie pobierz dane, w tym aktualną okładkę.
        await dispatch(fetchAnimeBySlug(slug));
      } catch (err) {
        setSaveError(
          err.response?.data?.message ||
          'Failed to update anime.'
        );
      } finally {
        setIsSaving(false);
      }
    };

   /* =====================================================
      EDIT ANIME FORM
      ===================================================== */

   return (
     <div className={styles.root}>
       <Container>

         {/* Page heading */}
        <h1>Edit anime</h1>

        {/* Title of the anime currently being edited */}
        <h3>{anime.title}</h3>

        {/* Form initialized with the selected anime's data */}
        {saveError && <p className="text-danger">{saveError}</p>}

         <AnimeForm
           anime={anime}
           onSubmit={handleEditAnime}
           submitText="Save changes"
           isSaving={isSaving}
         />

         {/*<AnimeCoverUpload
           anime={anime}
           onUpload={handleUploadCover}
           isUploading={isUploadingCover}
         />*/}

      </Container>
    </div>
  )
}

export default EditAnime