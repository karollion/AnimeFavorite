import styles from './Button.module.scss';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

/**
 * Można użyc na dwa sposoby jako button i jako link:
 * <Button action={handleSave}>Save</Button>
 * <Button to="/profile">Profile</Button>
 * 
 * @param {*} param0 
 * @returns 
 */
const Button = ({
  children,
  to,
  action,
  type = 'button',
  color = 'primary',
  active = true,
}) => {

  const classNames = clsx(
    styles.button,
    styles[color],
    !active && styles.disabled
  );

  /* ================= LINK BUTTON ================= */

  if (to) {
    return (
      <Link to={to} className={classNames} onClick={action}>
        <span className={styles.content}>{children}</span>
      </Link>
    );
  }

  /* ================= NORMAL BUTTON ================= */

  return (
    <button
      type={type}
      onClick={action}
      disabled={!active}
      className={classNames}
    >
      <span className={styles.content}>{children}</span>
    </button>
  );
};

export default Button;