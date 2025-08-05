import axios from 'axios';

// Get token from localStorage
const token = localStorage.getItem('token');

// Create pre-configured Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000', // Change if your backend runs on a different port
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
  },
});

export default api;
