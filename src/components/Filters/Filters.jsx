// src/components/Filters/Filters.jsx
import { useState, useEffect } from "react";
import api from "../../services/api.js";
import { rentalPrices } from "../../data/filterData";
import { formatMileage } from "../../utils/formatters.js"; // Імпортуємо функцію форматування
import css from "./Filters.module.css";

const BRANDS_API_URL = "brands";

const Filters = ({ onFilterChange, initialFilters }) => {
  const [brand, setBrand] = useState(initialFilters.brand || "");
  const [price, setPrice] = useState(initialFilters.price || "");

  // Status for actual numeric values | Стан для фактичних числових значень
  const [mileageMin, setMileageMin] = useState(initialFilters.mileageMin || "");
  const [mileageMax, setMileageMax] = useState(initialFilters.mileageMax || "");

  // Status for displayed values in input fields (formatted) | Стан для відображуваних значень у полях вводу (відформатованих)
  const [displayMileageMin, setDisplayMileageMin] = useState(
    initialFilters.mileageMin ? formatMileage(initialFilters.mileageMin) : ""
  );
  const [displayMileageMax, setDisplayMileageMax] = useState(
    initialFilters.mileageMax ? formatMileage(initialFilters.mileageMax) : ""
  );

  const [carBrands, setCarBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [brandsError, setBrandsError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setBrandsLoading(true);
      setBrandsError(null);
      try {
        const response = await api.get(BRANDS_API_URL);
        setCarBrands(response.data);
      } catch (err) {
        console.error("Failed to fetch car brands:", err);
        setBrandsError("Failed to load brands. Please try again later.");
      } finally {
        setBrandsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Updating states when initialFilters change (e.g. when resetting via route) | Оновлення станів при зміні initialFilters (наприклад, при скиданні через маршрут)
  useEffect(() => {
    setBrand(initialFilters.brand || "");
    setPrice(initialFilters.price || "");
    setMileageMin(initialFilters.mileageMin || "");
    setMileageMax(initialFilters.mileageMax || "");
    setDisplayMileageMin(
      initialFilters.mileageMin ? formatMileage(initialFilters.mileageMin) : ""
    );
    setDisplayMileageMax(
      initialFilters.mileageMax ? formatMileage(initialFilters.mileageMax) : ""
    );
  }, [initialFilters]);

  const handleSearch = () => {
    const newFilters = {
      brand,
      price,
      mileageMin,
      mileageMax,
    };
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setBrand("");
    setPrice("");
    setMileageMin("");
    setMileageMax("");
    setDisplayMileageMin("");
    setDisplayMileageMax("");

    onFilterChange({
      brand: "",
      price: "",
      mileageMin: "",
      mileageMax: "",
    });
  };

  // Handler for changing the value in the field (user types) | Обробник зміни значення в полі (користувач набирає)
  const handleMileageChange = (e, setMileage, setDisplayMileage) => {
    const rawValue = e.target.value.replace(/\s/g, ""); // Remove spaces (if the user copied a formatted value) | Видаляємо пробіли (якщо користувач скопіював відформатоване значення)
    const numValue = Number(rawValue);

    // Updating the actual numerical status | Оновлюємо фактичний числовий стан
    // Set to an empty string if the value is not a number or is empty after removing spaces | Встановлюємо порожній рядок, якщо значення не є числом або порожнє після видалення пробілів
    setMileage(isNaN(numValue) || rawValue === "" ? "" : numValue);
    // Update the displayed state with what the user entered (without formatting while typing) | Оновлюємо відображуваний стан тим, що користувач ввів (без форматування під час набору)
    setDisplayMileage(e.target.value);
  };

  // Focus loss handler (formatting) | Обробник втрати фокусу (форматування)
  const handleMileageBlur = (value, setDisplayMileage) => {
    setDisplayMileage(formatMileage(value));
  };

  // Focus handler (return to a pure number) | Обробник отримання фокусу (повернення до чистого числа)
  const handleMileageFocus = (value, setDisplayMileage) => {
    // Show a pure number (if there is one), otherwise an empty string | Показуємо чисте число (якщо воно є), інакше порожній рядок
    setDisplayMileage(value === "" ? "" : value.toString());
  };

  return (
    <div className={css.filtersWrapper}>
      <div className={css.filterGroup}>
        <label htmlFor="brand-select" className={css.filterLabel}>
          Car brand
        </label>
        <select
          id="brand-select"
          className={css.filterSelect}
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          disabled={brandsLoading}
        >
          <option value="">Choose a brand</option>
          {brandsLoading && (
            <option value="" disabled>
              Loading brands...
            </option>
          )}
          {brandsError && (
            <option value="" disabled>
              Error loading brands
            </option>
          )}
          {!brandsLoading &&
            !brandsError &&
            carBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
        </select>
      </div>

      <div className={css.filterGroup}>
        <label htmlFor="price-select" className={css.filterLabel}>
          Price/ 1 hour
        </label>
        <select
          id="price-select"
          className={css.filterSelect}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        >
          <option value="">Choose a price</option>
          {rentalPrices.map((p) => (
            <option key={p} value={p}>
              ${p}
            </option>
          ))}
        </select>
      </div>

      <div className={css.filterGroup}>
        <label htmlFor="mileage-min" className={css.filterLabel}>
          Car mileage / km
        </label>
        <div className={css.mileageInputs}>
          {/* Input for "From" */}
          <div
            className={`${css.mileageInputContainer} ${css.mileageMinContainer}`}
          >
            <span className={css.mileagePrefix}>From:</span>
            <input
              type="text" // Changed to text to allow formatting | Змінено на text, щоб дозволити форматування
              id="mileage-min"
              className={css.mileageInputField}
              value={displayMileageMin} // We use the display state to display | Використовуємо display-стан для відображення
              onChange={(e) =>
                handleMileageChange(e, setMileageMin, setDisplayMileageMin)
              }
              onBlur={() => handleMileageBlur(mileageMin, setDisplayMileageMin)}
              onFocus={() =>
                handleMileageFocus(mileageMin, setDisplayMileageMin)
              }
            />
          </div>
          {/* Input for "To" */}
          <div
            className={`${css.mileageInputContainer} ${css.mileageMaxContainer}`}
          >
            <span className={css.mileagePrefix}>To:</span>
            <input
              type="text" // Changed to text to allow formatting | Змінено на text, щоб дозволити форматування
              id="mileage-max"
              className={css.mileageInputField}
              value={displayMileageMax} // We use the display state to display | Використовуємо display-стан для відображення
              onChange={(e) =>
                handleMileageChange(e, setMileageMax, setDisplayMileageMax)
              }
              onBlur={() => handleMileageBlur(mileageMax, setDisplayMileageMax)}
              onFocus={() =>
                handleMileageFocus(mileageMax, setDisplayMileageMax)
              }
            />
          </div>
        </div>
      </div>

      <button type="button" onClick={handleSearch} className={css.searchBtn}>
        Search
      </button>
      <button type="button" onClick={handleReset} className={css.resetBtn}>
        Reset
      </button>
    </div>
  );
};

export default Filters;
