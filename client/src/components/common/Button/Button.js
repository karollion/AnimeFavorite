
/* =====================================================
   Button
   ===================================================== */

/**
 * @file Button.js
 * @description Reusable button component that supports
 * both standard buttons and navigation links.
 */

/* =====================================================
   STYLES AND DEPENDENCIES
   ===================================================== */

import styles from './Button.module.scss'

import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

/* =====================================================
   COMPONENT
   ===================================================== */

/**
 * Reusable button component.
 *
 * Supports two modes:
 * 1. Standard button with an optional action callback.
 * 2. Navigation link using React Router.
 *
 * Examples:
 * <Button action={handleSave}>Save</Button>
 * <Button to="/profile">Profile</Button>
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Button content.
 * @param {string} [props.to] - Navigation destination.
 * @param {Function} [props.action] - Callback executed on click.
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Button type.
 * @param {'primary'|'secondary'|string} [props.color='primary'] - CSS color variant.
 * @param {boolean} [props.active=true] - Determines whether the button is enabled.
 * @returns {JSX.Element} Button or navigation link.
 */
const Button = ({
  children,
  to,
  action,
  type = 'button',
  color = 'primary',
  active = true,
}) => {

  /* =====================================================
     CSS CLASS NAMES
     ===================================================== */

  const classNames = clsx(
    styles.button,
    styles[color],
    !active && styles.disabled
  )

  /* =====================================================
     LINK BUTTON
     ===================================================== */

  if (to) {
    /**
     * Prevents navigation and callback execution
     * when the link is inactive.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event
     */
    const handleLinkClick = (event) => {
      if (!active) {
        event.preventDefault()
        return
      }

      action?.(event)
    }

    return (
      <Link
        to={to}
        className={classNames}
        onClick={handleLinkClick}
        aria-disabled={!active}
        tabIndex={active ? undefined : -1}
      >
        <span className={styles.content}>
          {children}
        </span>
      </Link>
    )
  }

  /* =====================================================
     STANDARD BUTTON
     ===================================================== */

  return (
    <button
      type={type}
      onClick={action}
      disabled={!active}
      className={classNames}
    >
      <span className={styles.content}>
        {children}
      </span>
    </button>
  )
}

/* =====================================================
   PROP TYPES
   ===================================================== */

Button.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string,
  action: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  color: PropTypes.string,
  active: PropTypes.bool,
}

export default Button
