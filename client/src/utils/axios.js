import axios from "axios";

/* =====================================================
   AXIOS INSTANCE
   ===================================================== */

const instance = axios.create({
  baseURL: "http://localhost:3030/api", // backend URL
  withCredentials: true,
});

/* =====================================================
   REQUEST INTERCEPTOR
   (auto token attach later)
   ===================================================== */

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

export default instance;