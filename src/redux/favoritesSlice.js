// src/redux/favoritesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      const carToAdd = action.payload;
      if (!state.items.some((car) => car.id === carToAdd.id)) {
        state.items.push(carToAdd);
      }
    },
    removeFavorite: (state, action) => {
      const carIdToRemove = action.payload;
      state.items = state.items.filter((car) => car.id !== carIdToRemove);
    },

    loadFavorites: (state) => {
      try {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
          state.items = JSON.parse(storedFavorites);
        }
      } catch (error) {
        console.error("Failed to load favorites from localStorage:", error);
        state.items = [];
      }
    },
  },
});

export const { addFavorite, removeFavorite, loadFavorites } =
  favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.items;

export default favoritesSlice.reducer;
