import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
// });
const API = axios.create({
  baseURL: "https://smart-it-backend-production.up.railway.app/",
});

// 🔥 إضافة Token تلقائي
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;