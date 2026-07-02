import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

// ==============================
// Request Interceptor
// ==============================

api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)

);

// ==============================
// Response Interceptor
// ==============================

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (
      error.response &&
      error.response.status === 401
    ) {

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      if (window.location.pathname !== "/") {

        alert("Your session has expired. Please login again.");

        window.location.href = "/";
      }
    }

    return Promise.reject(error);

  }

);

export default api;