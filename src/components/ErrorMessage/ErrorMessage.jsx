// src/components/ErrorMessage/ErrorMessage.jsx
import css from "./ErrorMessage.module.css";

const ErrorMessage = ({ message }) => {
  return (
    <div className={css.errorWrapper}>
      <p className={css.errorMessage}>Error: {message}</p>
    </div>
  );
};

export default ErrorMessage;
