// src/pages/CarDetailsPage/CarDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SlLocationPin } from "react-icons/sl";
import { FaRegCheckCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import css from "./CarDetailsPage.module.css";

const CAR_API_BASE_URL = "https://car-rental-api.goit.global/cars";

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carDetails, setCarDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bookingDate: "",
    comment: "",
  });

  const getMinBookingDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Місяці від 0 до 11
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.bookingDate) {
      toast.error(
        "Please fill in all required fields (Name, Email, Booking date)."
      );
      return;
    }

    const selectedDate = new Date(formData.bookingDate);
    const minAllowedDate = new Date(getMinBookingDate()); // Завтрашня дата

    // Встановлюємо час на початок дня для коректного порівняння
    selectedDate.setHours(0, 0, 0, 0);
    minAllowedDate.setHours(0, 0, 0, 0);

    if (selectedDate < minAllowedDate) {
      toast.error("Booking date must be tomorrow or later.");
      return;
    }

    const bookingDetails = {
      carId: carId,
      carBrand: brand,
      carModel: model,
      carYear: year,
      rentalPrice: rentalPrice,
      ...formData,
    };

    console.log("Booking details submitted:", bookingDetails);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Your rental request has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        bookingDate: "",
        comment: "",
      });
    } catch (submitError) {
      toast.error("Failed to send your rental request. Please try again.");
      console.error("Form submission error:", submitError);
    }
  };

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
  const city = addressParts[addressParts.length - 2] || "N/A";
  const country = addressParts[addressParts.length - 1] || "N/A";
  const formattedMileage = new Intl.NumberFormat("uk-UA").format(mileage);

  const minBookingDate = getMinBookingDate();

  return (
    <main className={css.pageContainer}>
      <div className={css.detailsWrapper}>
        <div className={css.leftColumn}>
          <div className={css.imageBlock}>
            <img src={img} alt={`${brand} ${model}`} className={css.carImage} />
          </div>

          <div className={css.rentalForm}>
            <div className={css.formTitleContainer}>
              <h2 className={css.formTitle}>Book your car now</h2>
              <p className={css.formSubtitle}>
                Stay connected! We are always ready to help you.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={css.inputGroup}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name*"
                  className={css.textInput}
                  required
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className={css.inputGroup}>
                <input
                  type="date"
                  id="bookingDate"
                  name="bookingDate"
                  placeholder="Booking date"
                  className={css.dateInput}
                  required
                  value={formData.bookingDate}
                  onChange={handleChange}
                  min={minBookingDate}
                />
              </div>

              <div className={css.inputGroup}>
                <textarea
                  id="comment"
                  name="comment"
                  placeholder="Comment"
                  className={css.commentInput}
                  rows="4"
                  value={formData.comment}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className={css.submitBtn}>
                Send
              </button>
            </form>
          </div>
        </div>

        <div className={css.rightColumn}>
          <div className={css.detailsBlock}>
            <div className={css.detailsTitleContainer}>
              <h1 className={css.mainTitle}>
                {brand} <span className={css.modelAccent}>{model}</span>, {year}
              </h1>
              <p className={css.carIdText}>ID: {carId}</p>
            </div>

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

            <p className={css.description}>{description}</p>
          </div>

          <div className={css.carInfoBlock}>
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
      <ToastContainer />
    </main>
  );
};

export default CarDetailsPage;
