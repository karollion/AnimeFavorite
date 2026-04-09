import axios from "axios";

/* =====================================================
   AXIOS INSTANCE
   ===================================================== */

const api = axios.create({
  baseURL: "http://127.0.0.1:3030/api", // backend URL
  withCredentials: true,
});

/* =====================================================
   REQUEST INTERCEPTOR
   (auto token attach later)
   ===================================================== */

api.interceptors.request.use(async config => {
    const token = localStorage.getItem("token");

    if (process.env.NODE_ENV === 'development') {
      await new Promise(res => setTimeout(res, 1000));
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

export default api;