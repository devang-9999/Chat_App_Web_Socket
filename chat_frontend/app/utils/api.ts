import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('userInfo');
  if (user) {
    config.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  }
  return config;
});

export default api;
