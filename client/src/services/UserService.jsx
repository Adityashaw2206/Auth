import axios from "axios";


//for development
// const API = "http://localhost:5000/api/user";

//for production
const API = import.meta.env.VITE_API_URL;


axios.defaults.withCredentials = true;

// UPDATE
export const updateUserAPI = (id, data) =>
  axios.patch(`${API}/api/user/update/${id}`, data);

// DELETE
export const deleteUserAPI = (id) =>
  axios.delete(`${API}/api/user/delete/${id}`);
