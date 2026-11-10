
/* =====================================================
   Container
   ===================================================== */

/**
 * @file Container.js
 * @description Reusable layout container that provides
 * consistent styling for its child elements.
 */

/* =====================================================
   STYLES AND DEPENDENCIES
   ===================================================== */

import styles from './Container.module.scss'
import PropTypes from 'prop-types'

/* =====================================================
   COMPONENT
   ===================================================== */

/**
 * Renders a styled container for its children.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Content rendered inside the container.
 * @returns {JSX.Element} Styled container.
 */
const Container = ({ children }) => {
  return (
    <div className={styles.root}>
      {children}
    </div>
  )
}

/* =====================================================
   PROP TYPES
   ===================================================== */

Container.propTypes = {
  children: PropTypes.node,
}

export default Container
