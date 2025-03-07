import axios from "axios";
import { getCookie } from "cookies-next"; 

// Créer une instance d'Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  // baseURL: 'https://orbitcity.sn/api/',
  headers: {
      'Content-Type': 'application/json', 
      'Accept': 'application/json'
  }
});



axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/auth/login';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(getCookie('__GESTIO-MAIRIE_REACT_AUTH__TOKEN'));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
        config.headers = {
            Authorization : 'No Authorization'
        };
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;