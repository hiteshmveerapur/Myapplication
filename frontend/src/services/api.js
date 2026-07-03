// 1. THIS IS THE LINE THAT WAS MISSING!
import axios from "axios";

// 2. Setup the connection
const api = axios.create({
  // Make sure this matches your actual Render backend URL!
  baseURL: "https://myapplication-backend.onrender.com/api", 
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// 3. Automatically attach the user's login token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;