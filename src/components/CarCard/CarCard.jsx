// src/components/CarCard/CarCard.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
  selectFavorites,
} from "../../redux/favoritesSlice";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

import css from "./CarCard.module.css";

const CarCard = ({ car }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);

  const isFavorite = favorites.some((favCar) => favCar.id === car.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(car.id));
    } else {
      dispatch(addFavorite(car));
    }
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat("uk-UA").format(mileage);
  };

  const addressParts = car.address ? car.address.split(", ") : ["", "", ""];
  const city = addressParts[1] || "N/A";
  const country = addressParts[2] || "N/A";

  return (
    <li className={css.card}>
      <div className={css.imageWrapper}>
        <img
          src={car.img}
          alt={`${car.make || car.brand} ${car.model}`}
          className={css.carImage}
        />
        <button
          type="button"
          className={`${css.favoriteBtn} ${isFavorite ? css.isFavorite : ""}`}
          onClick={toggleFavorite}
        >
          {isFavorite ? (
            <FaHeart size={18} /> // Заповнене серце
          ) : (
            <FaRegHeart size={18} /> // Порожнє серце
          )}
        </button>
      </div>
      <div className={css.infoTop}>
        <h2 className={css.title}>
          {car.make || car.brand} <span className={css.model}>{car.model}</span>
          , {car.year}
        </h2>
        <p className={css.price}>${car.rentalPrice}</p>
      </div>
      <div className={css.infoBottom}>
        {/* ПЕРШИЙ СПИСОК */}
        <ul className={css.detailsList}>
          <li>{city}</li>
          <li>{country}</li>
          <li>{car.rentalCompany}</li>
        </ul>
        {/* ДРУГИЙ СПИСОК */}
        <ul className={css.detailsList}>
          {" "}
          <li>{car.type}</li>
          <li>{formatMileage(car.mileage)} km</li>
        </ul>
      </div>
      <Link to={`/catalog/${car.id}`} className={css.learnMoreBtn}>
        Read more
      </Link>
    </li>
  );
};

export default CarCard;
