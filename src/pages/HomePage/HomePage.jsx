// src/pages/HomePage/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import css from "./HomePage.module.css";

const HomePage = () => {
  const navigate = useNavigate();

  const handleCatalogClick = () => {
    navigate("/catalog");
  };

  return (
    <section className={css.heroSection}>
      <div className={css.container}>
        <h1 className={css.heroTitle}>Find your perfect rental car</h1>
        <p className={css.heroDescription}>
          Reliable and budget-friendly rentals for any journey
        </p>
        <button
          type="button"
          className={css.catalogButton}
          onClick={handleCatalogClick}
        >
          View Catalog
        </button>
      </div>
    </section>
  );
};

export default HomePage;
