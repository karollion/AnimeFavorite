
import { useEffect } from 'react';
import clsx from 'clsx';

import styles from './MessageWindow.module.scss';
import Button from '../../common/Button/Button';

/**
 * Uniwersalne okno komunikatów i potwierdzeń.
 *
 * @param {boolean} isOpen - Czy okno ma być widoczne.
 * @param {string} title - Tytuł okna.
 * @param {string} message - Treść komunikatu.
 * @param {'alert'|'confirm'} mode - Tryb: jeden przycisk lub Tak/Nie.
 * @param {string} confirmText - Tekst głównego przycisku.
 * @param {string} cancelText - Tekst przycisku anulowania.
 * @param {Function} onConfirm - Akcja po potwierdzeniu.
 * @param {Function} onCancel - Akcja po anulowaniu.
 * @param {Function} onClose - Akcja zamknięcia okna.
 */
const MessageWindow = ({
  isOpen = false,
  title = 'Informacja',
  message = '',
  mode = 'alert',
  confirmText = 'OK',
  cancelText = 'Nie',
  onConfirm,
  onCancel,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose?.();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose?.();
    }
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
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
        <h2
          id="message-window-title"
          className={styles.title}
        >
          {title}
        </h2>

        <p
          id="message-window-message"
          className={styles.message}
        >
          {message}
        </p>

        <div className={styles.actions}>
          <Button action={handleConfirm}>
            {confirmText}
          </Button>

          {mode === 'confirm' && (
            <Button
              action={handleCancel}
              color="secondary"
            >
              {cancelText}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default MessageWindow;
