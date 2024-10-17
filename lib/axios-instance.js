import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  baseURL: "https://spend-smart-8tkziacom-selim-haspolat.vercel.app/",
});

export default instance;
