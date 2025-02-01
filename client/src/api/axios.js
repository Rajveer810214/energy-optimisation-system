import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api/admin',
  withCredentials: true // This enables sending cookies with requests
});

export default api;