import styles from './Button.module.scss';

const Button = ({action, ...props}) => {
  return (
    <button 
      className={styles.button}
      onClick={action}
      type={props.type}
    >{props.children}</button>);
};

export default Button;