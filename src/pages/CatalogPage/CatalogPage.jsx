// src/pages/CatalogPage/CatalogPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCars,
  selectCarsIsLoading,
  selectCarsError,
  selectAllCars,
  selectCurrentPage,
  selectCarsLimit,
  selectTotalPages,
  incrementPage,
  resetCars,
  setFilters,
  selectFilters,
} from "../../redux/carsSlice";

import CarCard from "../../components/CarCard/CarCard";
import Filters from "../../components/Filters/Filters";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import css from "./CatalogPage.module.css";

const CatalogPage = () => {
  const dispatch = useDispatch();
  const cars = useSelector(selectAllCars);
  const isLoading = useSelector(selectCarsIsLoading);
  const error = useSelector(selectCarsError);
  const currentPage = useSelector(selectCurrentPage);
  const limit = useSelector(selectCarsLimit);
  const totalPages = useSelector(selectTotalPages);
  const currentFilters = useSelector(selectFilters);

  const [noCarsFound, setNoCarsFound] = useState(false);

  useEffect(() => {
    dispatch(
      fetchCars({
        page: 1,
        limit,
        brand: currentFilters.brand,
        price: currentFilters.price,
        mileageMin: currentFilters.mileageMin,
        mileageMax: currentFilters.mileageMax,
      })
    );
    setNoCarsFound(false);

    return () => {
      dispatch(resetCars());
    };
  }, [dispatch, limit, currentFilters]);

  useEffect(() => {
    if (!isLoading && !error && cars.length === 0 && currentPage === 1) {
      setNoCarsFound(true);
    } else {
      setNoCarsFound(false);
    }
  }, [isLoading, error, cars, currentPage]);

  const handleLoadMore = () => {
    dispatch(incrementPage());
    dispatch(
      fetchCars({
        page: currentPage + 1,
        limit,
        brand: currentFilters.brand,
        price: currentFilters.price,
        mileageMin: currentFilters.mileageMin,
        mileageMax: currentFilters.mileageMax,
      })
    );
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const showLoadMore =
    !isLoading && cars.length > 0 && currentPage < totalPages;

  return (
    <main className={css.catalogPage}>
      <div className={css.container}>
        <Filters
          onFilterChange={handleFilterChange}
          initialFilters={currentFilters}
        />

        {isLoading && <Loader />}
        {error && (
          <ErrorMessage message={error.message || "Failed to fetch cars."} />
        )}

        {!isLoading && !error && noCarsFound && (
          <p className={css.noCarsMessage}>
            No cars found matching your criteria.
          </p>
        )}

        {!noCarsFound && (
          <ul className={css.carsList}>
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </ul>
        )}

        {showLoadMore && (
          <button
            type="button"
            className={css.loadMoreBtn}
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load more"}
          </button>
        )}
      </div>
    </main>
  );
};

export default CatalogPage;
