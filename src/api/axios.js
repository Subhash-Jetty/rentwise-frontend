import axios from "axios";

const fallbackBaseURL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://rentwise-backend-1-gnu2.onrender.com";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || fallbackBaseURL,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
