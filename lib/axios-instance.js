import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  baseURL: "http://spend-smart-ebon.vercel.app/api",
});

export default instance;
