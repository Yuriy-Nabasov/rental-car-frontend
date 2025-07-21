// src/redux/carSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchCars = createAsyncThunk(
  "cars/fetchCars",
  async ({
    page = 1,
    limit = 12,
    brand = "",
    price = "",
    mileage = {},
  } = {}) => {
    try {
      const params = { page, limit };

      if (brand) {
        params.make = brand;
      }
      if (price) {
        params.rentalPrice = price;
      }
      if (mileage.from) {
        params.minMileage = mileage.from;
      }
      if (mileage.to) {
        params.maxMileage = mileage.to;
      }

      const response = await api.get("/cars", { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch cars");
    }
  }
);

const carSlice = createSlice({
  name: "cars",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    page: 1,
    limit: 12,
    hasMore: true,
    filters: {
      brand: "",
      price: "",
      mileage: {
        from: "",
        to: "",
      },
    },
    favorites: [],
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const carId = action.payload;
      const isFavorite = state.favorites.includes(carId);
      if (isFavorite) {
        state.favorites = state.favorites.filter((id) => id !== carId);
      } else {
        state.favorites.push(carId);
      }
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    loadFavorites: (state) => {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        state.favorites = JSON.parse(storedFavorites);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.isLoading = false;
        if (
          (state.page === 1 && state.items.length === 0) ||
          state.filters.brand ||
          state.filters.price ||
          state.filters.mileage.from ||
          state.filters.mileage.to
        ) {
          state.items = action.payload;
        } else {
          state.items = [...state.items, ...action.payload];
        }
        state.hasMore = action.payload.length === state.limit;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { toggleFavorite, setFilters, incrementPage, loadFavorites } =
  carSlice.actions;

export default carSlice.reducer;
