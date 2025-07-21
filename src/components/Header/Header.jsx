// src/components/Header/Header.jsx
import React from "react";
import { NavLink, Link } from "react-router-dom";
import css from "./Header.module.css";

const Header = () => {
  return (
    <header className={css.header}>
      <div className={css.container}>
        <Link to="/" className={css.logo}>
          <span className={css.logoPartRental}>Rental</span>
          <span className={css.logoPartCar}>Car</span>
        </Link>

        <nav className={css.navigation}>
          <ul className={css.navList}>
            <li className={css.navItem}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? css.activeLink : css.navLink
                }
              >
                Home
              </NavLink>
            </li>
            <li className={css.navItem}>
              <NavLink
                to="/catalog"
                className={({ isActive }) =>
                  isActive ? css.activeLink : css.navLink
                }
              >
                Catalog
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
