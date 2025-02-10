import axios from "axios";


const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', 
    timeout: 15000, // 15 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    },
});

// Add a request interceptor
// axiosInstance.interceptors.request.use(
// );
  
// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle global errors
      return Promise.reject(error);
    }
);

export default axiosInstance;
