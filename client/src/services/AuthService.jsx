import axios from "axios";

// const API = "http://localhost:5000/api/auth";
const API = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
// LOGIN
export const loginUser = (data) =>
  axios.post(`${API}/api/auth/login`, data);

// REGISTER
export const registerUser = (data) =>
  axios.post(`${API}/api/auth/signup`, data);

// LOGOUT
export const logoutUser = () =>
  axios.post(`${API}/api/auth/logout`);

// REFRESH TOKEN
export const refreshTokenAPI = () =>
  axios.get(`${API}/api/auth/refreshtoken`);

// GOOGLE LOGIN
export const googleLoginAPI = (data) =>
  axios.post(`${API}/api/auth/google`, data);