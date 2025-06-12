import axios from "axios";

const requestAxios = axios.create({

  baseURL: import.meta.env.VITE_API_URL,
});

export { requestAxios };
