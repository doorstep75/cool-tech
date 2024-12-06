// Import Axios for HTTP requests
import axios from 'axios';

// Create an Axios instance with a base URL
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Interceptor to attach token to requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Export the instance for use in the app
export default instance;