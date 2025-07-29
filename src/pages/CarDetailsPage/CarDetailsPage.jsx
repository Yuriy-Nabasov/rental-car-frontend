import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import { SlLocationPin } from "react-icons/sl";
import {
  FaRegCheckCircle,
  FaCalendarAlt,
  FaCar,
  FaGasPump,
  FaCog,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader.jsx";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage.jsx";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import css from "./CarDetailsPage.module.css";

const CAR_API_BASE_URL = "cars";

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carDetails, setCarDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pickupDate: null,
    dropoffDate: null,
    comment: "",
  });

  const getMinDateTimeFromNow = () => {
    const now = new Date();
    const minTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours in milliseconds | Додаємо 24 години в мілісекундах

    // Round to the nearest hour to avoid selecting minutes | Округляємо до найближчої години вперед, щоб уникнути вибору хвилин
    // If the current minutes or seconds are not zero, add another hour and reset the minutes/seconds to zero. | Якщо поточні хвилини або секунди не нуль, додаємо ще одну годину і обнуляємо хвилини/секунди
    if (
      minTime.getMinutes() > 0 ||
      minTime.getSeconds() > 0 ||
      minTime.getMilliseconds() > 0
    ) {
      minTime.setHours(minTime.getHours() + 1);
      minTime.setMinutes(0, 0, 0);
    }
    return minTime;
  };

  // Function to get minimum return date/time based on rental start date | Функція для отримання мінімальної дати/часу повернення на основі дати початку оренди
  const getMinDropoffDateTime = (pickupDate) => {
    if (!pickupDate) {
      // If no start date is selected, the minimum return date is the beginning of tomorrow. | Якщо дата початку не обрана, мінімальна дата повернення - це початок завтрашнього дня
      // or minPickupDateTimeFromNow if it is later | або minPickupDateTimeFromNow, якщо вона пізніша
      const minStart = getMinDateTimeFromNow();
      return minStart;
    }
    const date = new Date(pickupDate);
    date.setHours(date.getHours() + 1); // Add one hour to the start date/time for the minimum duration | Додаємо одну годину до дати/часу початку для мінімальної тривалості
    date.setMinutes(0, 0, 0); // Reset minutes/seconds to zero to round to a whole hour | Обнуляємо хвилини/секунди для округлення до цілої години
    return date;
  };

  // Determines the minimum time for a DatePicker based on the selected date and the reference date/time | Визначає мінімальний час для DatePicker на основі обраної дати та опорної дати/часу
  const getMinTime = (selectedDate, referenceDate) => {
    if (
      selectedDate &&
      referenceDate &&
      selectedDate.toDateString() === referenceDate.toDateString()
    ) {
      return referenceDate;
    }
    // For any other day (after referenceDate), the minimum time is 00:00 | Для будь-якого іншого дня (після referenceDate), мінімальний час - 00:00
    const startOfDay = new Date(selectedDate || new Date()); // If selectedDate is not yet selected, we use the current one | Якщо selectedDate ще не обрана, використовуємо поточну
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  };

  // Sets the maximum time for the DatePicker for the given selected date | Визначає максимальний час для DatePicker для заданої обраної дати
  const getMaxTime = (selectedDate) => {
    if (!selectedDate) {
      // If the date is not set, return the end of the current day for the DatePicker to work correctly. | Якщо дата не встановлена, повертаємо кінець поточного дня для коректної роботи DatePicker
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      return endOfDay;
    }
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999); // Maximum time for any day is 23:59 | Максимальний час для будь-якого дня - 23:59
    return endOfDay;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date, name) => {
    if (name === "pickupDate") {
      setFormData((prevData) => {
        let newDropoffDate = prevData.dropoffDate;
        if (date && newDropoffDate && newDropoffDate <= date) {
          const minNewDropoff = new Date(date);
          minNewDropoff.setHours(minNewDropoff.getHours() + 1, 0, 0, 0);
          newDropoffDate = minNewDropoff;
        } else if (date && !newDropoffDate) {
          // If pickupDate is set and dropoffDate is not yet set | Якщо pickupDate встановлена, а dropoffDate ще не встановлена,
          // set dropoff to pickupDate + 1 hour. | встановлюємо dropoff на pickupDate + 1 годину.
          const minNewDropoff = new Date(date);
          minNewDropoff.setHours(minNewDropoff.getHours() + 1, 0, 0, 0);
          newDropoffDate = minNewDropoff;
        }
        return {
          ...prevData,
          pickupDate: date,
          dropoffDate: newDropoffDate,
        };
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: date,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.pickupDate ||
      !formData.dropoffDate
    ) {
      toast.error(
        "Please fill in all required fields (Name, Email, Booking start date & time, and Reservation end date & time)."
      );
      return;
    }

    const pickupDate = formData.pickupDate;
    const dropoffDate = formData.dropoffDate;

    // We check the date and time of the start of the booking relative to the current moment + 24 hours | Перевіряємо дату та час початку бронювання відносно поточного моменту + 24 години
    const minimumAllowedPickup = getMinDateTimeFromNow();
    if (pickupDate < minimumAllowedPickup) {
      toast.error(
        `Booking start date & time must be at least 24 hours from now.`
      );
      return;
    }

    // We check the rental end date and time against the start date and time (must be at least 1 hour later) | Перевіряємо дату та час закінчення оренди відносно дати та часу початку (повинно бути мінімум на 1 годину пізніше)
    if (dropoffDate <= pickupDate) {
      toast.error(
        "Reservation end date & time must be at least one hour after the booking start date & time."
      );
      return;
    }

    // Format dates into ISO strings for sending, including time and time zone information | Форматуємо дати в ISO-рядки для відправки, що включає інформацію про час та часовий пояс
    const formattedPickupDate = pickupDate.toISOString();
    const formattedDropoffDate = dropoffDate.toISOString();

    const bookingDetails = {
      carId: carId,
      carBrand: brand,
      carModel: model,
      carYear: year,
      rentalPrice: rentalPrice,
      name: formData.name,
      email: formData.email,
      pickupDate: formattedPickupDate,
      dropoffDate: formattedDropoffDate,
      comment: formData.comment,
    };

    console.log("Деталі бронювання відправлено:", bookingDetails);

    try {
      // Simulate an API call | Імітуємо виклик API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Your rental request has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        pickupDate: null,
        dropoffDate: null,
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
        const response = await api.get(`${CAR_API_BASE_URL}/${id}`);
        setCarDetails(response.data);
      } catch (err) {
        console.error("Не вдалося завантажити деталі автомобіля:", err);
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
        <Loader />
      </main>
    );
  }

  if (error) {
    return (
      <main className={css.pageContainer}>
        <ErrorMessage message={error} />
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
  const formattedMileage = new Intl.NumberFormat("en-US").format(mileage);

  const minPickupDateTimeConstraint = getMinDateTimeFromNow();
  const minPickupDate = minPickupDateTimeConstraint;
  const minTimeForPickup = getMinTime(
    formData.pickupDate || minPickupDateTimeConstraint,
    minPickupDateTimeConstraint
  );
  const maxPickupTime = getMaxTime(formData.pickupDate || new Date());

  const minDropoffDateTime = getMinDropoffDateTime(formData.pickupDate);
  const minTimeForDropoff = getMinTime(
    formData.dropoffDate || minDropoffDateTime,
    minDropoffDateTime
  );
  const maxDropoffTime = getMaxTime(formData.dropoffDate || new Date());

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

              {/* DatePicker for Booking Start Date & Time */}
              <div className={css.inputGroup}>
                <DatePicker
                  id="pickupDate"
                  name="pickupDate"
                  selected={formData.pickupDate}
                  onChange={(date) => handleDateChange(date, "pickupDate")}
                  dateFormat="yyyy-MM-dd HH:00"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={60}
                  timeCaption="Time"
                  placeholderText="Booking start date & time*"
                  minDate={minPickupDate}
                  minTime={minTimeForPickup}
                  maxTime={maxPickupTime}
                  className={css.dateInput}
                  inputClassName={css.dateInput}
                  required
                />
              </div>

              {/* DatePicker for Reservation End Date & Time */}
              <div className={css.inputGroup}>
                <DatePicker
                  id="dropoffDate"
                  name="dropoffDate"
                  selected={formData.dropoffDate}
                  onChange={(date) => handleDateChange(date, "dropoffDate")}
                  dateFormat="yyyy-MM-dd HH:00"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={60}
                  timeCaption="Time"
                  placeholderText="Reservation end date & time*"
                  minDate={minDropoffDateTime}
                  minTime={minTimeForDropoff}
                  maxTime={maxDropoffTime}
                  className={css.dateInput}
                  inputClassName={css.dateInput}
                  required
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
              </ul>
            </div>

            <div>
              <h2 className={css.carInfoSectionTitle}>Car Specifications:</h2>
              <ul className={css.carInfoList}>
                <li className={css.carInfoListItem}>
                  <FaCalendarAlt className={css.checkIcon} />
                  Year: <span className={css.carInfoValue}>{year}</span>
                </li>
                <li className={css.carInfoListItem}>
                  <FaCar className={css.checkIcon} />
                  Type: <span className={css.carInfoValue}>{type}</span>
                </li>
                <li className={css.carInfoListItem}>
                  <FaGasPump className={css.checkIcon} />
                  Fuel Consumption:{" "}
                  <span className={css.carInfoValue}>{fuelConsumption}</span>
                </li>
                <li className={css.carInfoListItem}>
                  <FaCog className={css.checkIcon} />
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
