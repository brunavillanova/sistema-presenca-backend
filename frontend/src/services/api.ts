import axios from "axios";

const api = axios.create({

  baseURL:
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://sistema-presenca-backend.onrender.com",
});

export default api;