// src/pages/CarDetailsPage/CarDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SlLocationPin } from "react-icons/sl";
import { FaRegCheckCircle } from "react-icons/fa";

import css from "./CarDetailsPage.module.css";

const CAR_API_BASE_URL = "https://car-rental-api.goit.global/cars";

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carDetails, setCarDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      navigate("/404");
      return;
    }

    const fetchCarDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${CAR_API_BASE_URL}/${id}`);
        setCarDetails(response.data);
      } catch (err) {
        console.error("Failed to fetch car details:", err);
        setError(
          "Failed to load car details. Please check the URL or try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetails();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <main className={css.pageContainer}>
        <p>Loading car details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={css.pageContainer}>
        <p>Error: {error}</p>
      </main>
    );
  }

  if (!carDetails) {
    return (
      <main className={css.pageContainer}>
        <p>No car details found for this ID.</p>
      </main>
    );
  }

  const {
    img,
    brand,
    model,
    year,
    rentalPrice,
    address,
    mileage,
    fuelConsumption,
    engineSize,
    description,
    accessories,
    functionalities,
    rentalConditions,
    type,
    id: carId,
  } = carDetails;

  const addressParts = address ? address.split(", ") : [];
  // Беремо передостанній елемент як місто, останній як країну
  const city = addressParts[addressParts.length - 2] || "N/A";
  const country = addressParts[addressParts.length - 1] || "N/A";
  const formattedMileage = mileage.toLocaleString("en-US");

  return (
    <main className={css.pageContainer}>
      <div className={css.detailsWrapper}>
        {/* ЛІВА КОЛОНКА */}
        <div className={css.leftColumn}>
          <div className={css.imageBlock}>
            <img src={img} alt={`${brand} ${model}`} className={css.carImage} />
          </div>

          {/* Форма для оренди */}
          <div className={css.rentalForm}>
            <div className={css.formTitleContainer}>
              <h2 className={css.formTitle}>Book your car now</h2>
              <p className={css.formSubtitle}>
                Stay connected! We are always ready to help you.
              </p>
            </div>

            <form>
              <div className={css.inputGroup}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name*"
                  className={css.textInput}
                  required
                />
              </div>

              <div className={css.inputGroup}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email*"
                  className={css.emailInput}
                  required
                />
              </div>

              <div className={css.inputGroup}>
                <input
                  type="date"
                  id="bookingDate"
                  name="bookingDate"
                  placeholder="Booking date"
                  className={css.dateInput}
                />
              </div>

              <div className={css.inputGroup}>
                <textarea
                  id="comment"
                  name="comment"
                  placeholder="Comment"
                  className={css.commentInput}
                  rows="4"
                ></textarea>
              </div>

              <button type="submit" className={css.submitBtn}>
                Send
              </button>
            </form>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА */}
        <div className={css.rightColumn}>
          {/* Блок з детальною інформацією (Details) */}
          <div className={css.detailsBlock}>
            {/* 1. Title */}
            <div className={css.detailsTitleContainer}>
              <h1 className={css.mainTitle}>
                {brand} <span className={css.modelAccent}>{model}</span>, {year}
              </h1>
              <p className={css.carIdText}>ID: {carId}</p>
            </div>

            {/* 2. Details (Location, Mileage, Price) */}
            <div className={css.locationMileageContainer}>
              <div className={css.locationBlock}>
                <SlLocationPin size={16} />
                <p className={css.locationText}>
                  {city}, {country}
                </p>
              </div>
              <p className={css.mileageText}>Mileage: {formattedMileage} km</p>
            </div>
            <p className={css.rentalPriceText}>${rentalPrice}</p>

            {/* 3. Description (text 1) */}
            <p className={css.description}>{description}</p>
          </div>

          {/* Блок з інформацією по машині (Car Info) */}
          <div className={css.carInfoBlock}>
            {/* 1. Rental Conditions */}
            <div>
              <h2 className={css.carInfoSectionTitle}>Rental Conditions:</h2>
              <ul className={css.carInfoList}>
                {rentalConditions &&
                  rentalConditions.map((condition, index) => {
                    const parts = condition.split(":");
                    return (
                      <li key={`rc-${index}`} className={css.carInfoListItem}>
                        <FaRegCheckCircle className={css.checkIcon} />{" "}
                        {parts.length > 1 ? (
                          <>
                            {parts[0].trim()}:{" "}
                            <span className={css.carInfoValue}>
                              {parts[1].trim()}
                            </span>
                          </>
                        ) : (
                          condition.trim()
                        )}
                      </li>
                    );
                  })}

                <li className={css.carInfoListItem}>
                  <FaRegCheckCircle className={css.checkIcon} />
                  Mileage:{" "}
                  <span className={css.carInfoValue}>
                    {formattedMileage} km
                  </span>
                </li>
                <li className={css.carInfoListItem}>
                  <FaRegCheckCircle className={css.checkIcon} />
                  Price:{" "}
                  <span className={css.carInfoValue}>{rentalPrice}$</span>
                </li>
              </ul>
            </div>

            {/* 2. Car Specifications */}
            <div>
              <h2 className={css.carInfoSectionTitle}>Car Specifications:</h2>
              <ul className={css.carInfoList}>
                <li className={css.carInfoListItem}>
                  <FaRegCheckCircle className={css.checkIcon} />
                  Year: <span className={css.carInfoValue}>{year}</span>
                </li>
                <li className={css.carInfoListItem}>
                  <FaRegCheckCircle className={css.checkIcon} />
                  Type: <span className={css.carInfoValue}>{type}</span>
                </li>
                <li className={css.carInfoListItem}>
                  <FaRegCheckCircle className={css.checkIcon} />
                  Fuel Consumption:{" "}
                  <span className={css.carInfoValue}>{fuelConsumption}</span>
                </li>
                <li className={css.carInfoListItem}>
                  <FaRegCheckCircle className={css.checkIcon} />
                  Engine Size:{" "}
                  <span className={css.carInfoValue}>{engineSize}</span>
                </li>
              </ul>
            </div>

            {/* 3. Accessories and functionalities */}
            <div>
              <h2 className={css.carInfoSectionTitle}>
                Accessories and functionalities:
              </h2>
              <ul className={css.carInfoList}>
                {accessories.map((item, index) => (
                  <li key={`acc-${index}`} className={css.carInfoListItem}>
                    <FaRegCheckCircle className={css.checkIcon} />
                    {item}
                  </li>
                ))}
                {functionalities.map((item, index) => (
                  <li key={`func-${index}`} className={css.carInfoListItem}>
                    <FaRegCheckCircle className={css.checkIcon} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CarDetailsPage;
