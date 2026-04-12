import api from "./api";
import axios from "axios";

const BASE = "http://localhost:8000/api/auth";

const authService = {
  register: async (username, email, password, password2) => {
    const res = await axios.post(`${BASE}/register/`, { username, email, password, password2 });
    localStorage.setItem("access",  res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    return res.data.user;
  },

  login: async (username, password) => {
    const res = await axios.post(`${BASE}/login/`, { username, password });
    localStorage.setItem("access",  res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  },

  getMe: async () => {
    const res = await api.get("/auth/me/");
    return res.data;
  },

  isLoggedIn: () => !!localStorage.getItem("access"),
};

export default authService;