// src/pages/CarDetailsPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
// import styles from './CarDetailsPage.module.css';

const CarDetailsPage = () => {
  const { id } = useParams(); // Отримуємо ID автомобіля з URL

  return (
    <div>
      <h1>Car Details for ID: {id}</h1>
      <p>Detailed information about the selected car.</p>
      {/* Тут буде детальний опис, фото та форма оренди */}
    </div>
  );
};

export default CarDetailsPage;
