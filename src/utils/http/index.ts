import axios from "axios";

export const normalApi = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
});

export const secureApi = axios.create({
  baseURL: import.meta.env.VITE_API_HOST + "/secure",
});

secureApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});
