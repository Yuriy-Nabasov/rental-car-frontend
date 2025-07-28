import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import css from "./Header.module.css";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={css.header}>
      <div className={css.container}>
        <Link to="/" className={css.logo} onClick={closeMobileMenu}>
          <span className={css.logoPartRental}>Rental</span>
          <span className={css.logoPartCar}>Car</span>
        </Link>

        {/* Hamburger button for mobile screens | Кнопка-гамбургер для мобільних екранів */}
        <button
          type="button"
          className={css.mobileMenuToggle}
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Navigation - will be visible on desktop, or when opening the mobile menu | Навігація - буде видима на десктопі, або при відкритті мобільного меню */}
        <nav
          className={`${css.navigation} ${
            isMobileMenuOpen ? css.mobileMenuOpen : ""
          }`}
        >
          <ul className={css.navList}>
            <li className={css.navItem}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? css.activeLink : css.navLink
                }
                onClick={closeMobileMenu}
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
                onClick={closeMobileMenu}
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
