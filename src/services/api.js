// src/services/api.js
import axios from "axios";
import { BASE_URL } from "../constants/api.js";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
