// src/pages/NotFoundPage/NotFoundPage.jsx
import { Link } from "react-router-dom";
import css from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={css.notFoundContainer}>
      <h1 className={css.title}>404 - Page Not Found</h1>
      <p className={css.message}>
        The page you are looking for does not exist.
      </p>
      <Link to="/" className={css.homeLink}>
        Go to Home Page
      </Link>
    </div>
  );
};

export default NotFoundPage;
