// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/produtos", // sem /produtos
});

export default api;
