import axios from 'axios';

const api = axios.create({
  baseURL: 'https://energy-optimisation-system.onrender.com/api/admin',
  withCredentials: true // This enables sending cookies with requests
});

export default api;