import axios from "axios";

const API = axios.create({
  baseURL: "https://contact-manager-mernbased.onrender.com/api",
});

export default API;