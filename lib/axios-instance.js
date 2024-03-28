import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  baseURL: "https://spend-smart.selimhaspolat.com/api",
});

export default instance;
