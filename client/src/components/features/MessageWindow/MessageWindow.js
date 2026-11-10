
/* =====================================================
   Message Window
   ===================================================== */

/**
 * @file MessageWindow.js
 * @description Reusable modal window for displaying messages
 *              and requesting user confirmation.
 */

/* =====================================================
   REACT HOOKS AND LIBRARIES
   ===================================================== */

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import PropTypes from 'prop-types'

/* =====================================================
   STYLES
   ===================================================== */

import styles from './MessageWindow.module.scss'

/* =====================================================
   UI COMPONENTS
   ===================================================== */

import Button from '../../common/Button/Button'

/* =====================================================
   MESSAGE WINDOW COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders a modal message window.
 *
 * Supports two modes:
 * - alert: Displays a message with a single confirmation button.
 * - confirm: Displays a message with confirmation and cancellation buttons.
 *
 * The component is controlled externally through MessageContext
 * and is displayed using the showMessage function.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Determines whether the window is visible.
 * @param {string} [props.title] - Window heading.
 * @param {string} [props.message] - Message content.
 * @param {'alert'|'confirm'} [props.mode] - Window display mode.
 * @param {string} [props.confirmText] - Confirmation button label.
 * @param {string} [props.cancelText] - Cancellation button label.
 * @param {Function} [props.onConfirm] - Callback executed on confirmation.
 * @param {Function} [props.onCancel] - Callback executed on cancellation.
 * @param {Function} [props.onClose] - Callback executed when the window closes.
 *
 * @returns {JSX.Element|null} The message window or null when closed.
 */
const MessageWindow = ({
  isOpen = false,
  title,
  message = '',
  mode = 'alert',
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  onClose,
}) => {
  /* =====================================================
     HOOKS AND TRANSLATIONS
     ===================================================== */

  const { t } = useTranslation()

  // Resolve default labels using the currently selected language.
  const displayTitle = title || t('messageWindow.defaultTitle')

  const displayConfirmText =
    confirmText ||
    (mode === 'confirm'
      ? t('messageWindow.confirm')
      : t('common.ok'))

  const displayCancelText =
    cancelText || t('messageWindow.cancel')

  /* =====================================================
     KEYBOARD AND BODY SCROLL HANDLING
     ===================================================== */

  /**
   * Handles keyboard interaction and prevents background scrolling
   * while the modal window is open.
   *
   * Pressing Escape closes the window.
   */
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    // Preserve the previous body overflow setting.
    const previousOverflow = document.body.style.overflow

    // Prevent scrolling behind the modal window.
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', handleKeyDown)

    // Restore the previous state when the modal closes or unmounts.
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  /* =====================================================
     EVENT HANDLERS
     ===================================================== */

  /**
   * Handles confirmation button clicks.
   * Uses the provided callback or closes the window by default.
   */
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    } else {
      onClose?.()
    }
  }

  /**
   * Handles cancellation button clicks.
   * Uses the provided callback or closes the window by default.
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onClose?.()
    }
  }

  /**
   * Closes the window when the user clicks outside its content.
   *
   * @param {React.MouseEvent<HTMLDivElement>} event
   */
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.()
    }
  }

  /* =====================================================
     CONDITIONAL RENDERING
     ===================================================== */

  // Do not render the modal when it is closed.
  if (!isOpen) return null

  /* =====================================================
     COMPONENT RENDER
     ===================================================== */

  return (
    <div
      className={styles.overlay}
      onMouseDown={handleOverlayClick}
    >
      <section
        className={clsx(
          styles.window,
          mode === 'confirm' && styles.confirm
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-window-title"
        aria-describedby="message-window-message"
      >
        {/* Modal heading */}
        <h2
          id="message-window-title"
          className={styles.title}
        >
          {displayTitle}
        </h2>

        {/* Message content */}
        <p
          id="message-window-message"
          className={styles.message}
        >
          {message}
        </p>

        {/* Modal action buttons */}
        <div className={styles.actions}>

          {/* Confirmation button */}
          <Button action={handleConfirm}>
            {displayConfirmText}
          </Button>

          {/* Cancellation button - only visible in confirmation mode */}
          {mode === 'confirm' && (
            <Button
              action={handleCancel}
              color="secondary"
            >
              {displayCancelText}
            </Button>
          )}

        </div>
      </section>
    </div>
  )
}

/* =====================================================
   PROP TYPES
   ===================================================== */

MessageWindow.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  mode: PropTypes.oneOf(['alert', 'confirm']),
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
}

export default MessageWindow
