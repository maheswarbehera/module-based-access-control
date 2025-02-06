import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',  // Replace with your base URL
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Check if the user is logged in and has a token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Add token to request headers
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // You can modify the response here if needed
    return response;
  },
  (error) => {
    // Handle response error (e.g., unauthorized error)
    if (error.response.status === 401) {
      // Redirect to login page or handle token refresh
      console.error("Unauthorized. Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default api;
