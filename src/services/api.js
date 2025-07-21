// src/services/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://car-rental-api.goit.global/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
