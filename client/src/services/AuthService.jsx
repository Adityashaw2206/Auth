import axios from "axios";

const API = "http://localhost:5000/api/auth";
axios.defaults.withCredentials = true;
// LOGIN
export const loginUser = (data) =>
  axios.post(`${API}/login`, data);

// REGISTER
export const registerUser = (data) =>
  axios.post(`${API}/signup`, data);

// LOGOUT
export const logoutUser = () =>
  axios.post(`${API}/logout`);

// REFRESH TOKEN
export const refreshTokenAPI = () =>
  axios.get(`${API}/refreshtoken`);

// GOOGLE LOGIN
export const googleLoginAPI = (data) =>
  axios.post(`${API}/google`, data);