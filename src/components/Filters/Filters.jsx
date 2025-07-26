// src/components/Filters/Filters.jsx
import { useState, useEffect } from "react";
import api from "../../services/api.js";
import { rentalPrices } from "../../data/filterData";
import css from "./Filters.module.css";

const BRANDS_API_URL = "brands";

const Filters = ({ onFilterChange, initialFilters }) => {
  const [brand, setBrand] = useState(initialFilters.brand || "");
  const [price, setPrice] = useState(initialFilters.price || "");
  const [mileageMin, setMileageMin] = useState(initialFilters.mileageMin || "");
  const [mileageMax, setMileageMax] = useState(initialFilters.mileageMax || "");

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

  useEffect(() => {
    setBrand(initialFilters.brand || "");
    setPrice(initialFilters.price || "");
    setMileageMin(initialFilters.mileageMin || "");
    setMileageMax(initialFilters.mileageMax || "");
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

    onFilterChange({
      brand: "",
      price: "",
      mileageMin: "",
      mileageMax: "",
    });
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
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className={css.filterGroup}>
        <label htmlFor="mileage-min" className={css.filterLabel}>
          Car mileage / km
        </label>
        <div className={css.mileageInputs}>
          <input
            type="number"
            id="mileage-min"
            className={`${css.filterInput} ${css.mileageMin}`}
            placeholder="From"
            value={mileageMin}
            onChange={(e) => setMileageMin(e.target.value)}
          />
          <input
            type="number"
            id="mileage-max"
            className={`${css.filterInput} ${css.mileageMax}`}
            placeholder="To"
            value={mileageMax}
            onChange={(e) => setMileageMax(e.target.value)}
          />
        </div>
      </div>

      <button type="button" onClick={handleSearch} className={css.searchBtn}>
        Search
      </button>
      {/* Додав кнопку ресет для скидування фільтрів */}
      <button type="button" onClick={handleReset} className={css.resetBtn}>
        Reset
      </button>
    </div>
  );
};

export default Filters;
