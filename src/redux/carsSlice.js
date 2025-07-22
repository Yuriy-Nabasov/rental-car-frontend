// src/redux/carsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://car-rental-api.goit.global";

export const fetchCars = createAsyncThunk(
  "cars/fetchCars",
  async (
    {
      page = 1,
      limit = 12,
      brand = "",
      price = "",
      mileageMin = "",
      mileageMax = "",
    },
    thunkAPI
  ) => {
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });

      if (brand) {
        params.append("brand", brand);
      }
      if (price) {
        params.append("rentalPrice", price);
      }
      if (mileageMin) {
        params.append("minMileage", mileageMin);
      }
      if (mileageMax) {
        params.append("maxMileage", mileageMax);
      }

      const response = await axios.get(`${BASE_URL}/cars?${params.toString()}`);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch cars"
      );
    }
  }
);

const carsSlice = createSlice({
  name: "cars",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    page: 1,
    limit: 12,
    totalCars: 0,
    totalPages: 0,
    filters: {
      brand: "",
      price: "",
      mileageMin: "",
      mileageMax: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
      state.items = [];
      state.totalCars = 0;
      state.totalPages = 0;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    resetCars: (state) => {
      state.items = [];
      state.page = 1;
      state.totalCars = 0;
      state.totalPages = 0;
      state.error = null;
      state.isLoading = false;
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
        const newCars = action.payload.cars;
        const requestedPage = action.meta.arg.page;

        if (requestedPage === 1) {
          state.items = newCars;
        } else {
          const existingCarIds = new Set(state.items.map((car) => car.id));
          const uniqueNewCars = newCars.filter(
            (car) => !existingCarIds.has(car.id)
          );
          state.items = [...state.items, ...uniqueNewCars];
        }

        state.totalCars = action.payload.totalCars;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, incrementPage, resetCars } = carsSlice.actions;

export const selectAllCars = (state) => state.cars.items;
export const selectCarsIsLoading = (state) => state.cars.isLoading;
export const selectCarsError = (state) => state.cars.error;
export const selectCurrentPage = (state) => state.cars.page;
export const selectCarsLimit = (state) => state.cars.limit;
export const selectTotalPages = (state) => state.cars.totalPages;
export const selectFilters = (state) => state.cars.filters;

export default carsSlice.reducer;
