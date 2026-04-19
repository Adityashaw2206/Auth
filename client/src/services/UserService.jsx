import axios from "axios";

// const API = "http://localhost:5000/api/user";
const API = import.meta.env.VITE_API_URL;


axios.defaults.withCredentials = true;

// UPDATE
export const updateUserAPI = (id, data) =>
  axios.patch(`${API}/update/${id}`, data);

// DELETE
export const deleteUserAPI = (id) =>
  axios.delete(`${API}/delete/${id}`);

// export const updateUserAPI = (id, data) => {
//   const token = localStorage.getItem("accessToken");

//   return axios.patch(`${API}/update/${id}`, data, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// export const deleteUserAPI = (id) => {
//   const token = localStorage.getItem("accessToken");

//   return axios.delete(`${API}/delete/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };