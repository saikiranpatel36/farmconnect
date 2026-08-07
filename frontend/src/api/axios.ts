import axios from 'axios';
import { API_URL } from '../config';

// attach the JWT token to every request if the user is logged in
const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((request) => {
  const token = localStorage.getItem('token');
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  return request;
});

export default api;
