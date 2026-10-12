/* =====================================================
   Add Anime Page
   ===================================================== */

/**
 * @file AddAnime.js
 * @description Page component for adding a new anime entity.
 *              Provides a page layout with a heading and the reusable
 *              AnimeForm component for entering anime data.
 */

import styles from './AddAnime.module.scss'

/* =====================================================
   COMPONENTS
   ===================================================== */

import AnimeForm from '../../features/AnimeForm/AnimeForm'
import Container from '../../common/container/Container'

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

  /* =====================================================
     PAGE LAYOUT
     ===================================================== */

  return (
    <div className={styles.root}>
      <Container>

        {/* Page heading */}
        <h1>Add new anime</h1>

        {/* Form for entering new anime data */}
        <AnimeForm />

      </Container>
    </div>
  )
}

export default AddAnime