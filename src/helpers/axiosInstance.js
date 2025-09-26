import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next"; 

// Créer une instance d'Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  // baseURL: "https://backendgl.kaolackcommune.sn/api",
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
      localStorage.removeItem('__GESTIO-MAIRIE_REACT_AUTH__TOKEN')
      localStorage.removeItem('__GESTIO-MAIRIE_REACT_AUTH__USER')
      localStorage.removeItem('__GESTIO-MAIRIE_REACT_AVATAR')
      localStorage.removeItem('__GESTIO-MAIRIE_REACT_AUTH__')
      localStorage.clear()
      deleteCookie('__GESTIO-MAIRIE_REACT_AUTH__TOKEN')
      deleteCookie('__GESTIO-MAIRIE_REACT_AUTH__USER')
      deleteCookie('__GESTIO-MAIRIE_REACT_AVATAR')
      deleteCookie('__GESTIO-MAIRIE_REACT_AUTH__')
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

    // if (['post', 'put', 'patch'].includes(config.method)) {
    //   config.headers['Content-Type'] = 'application/json';
    // }

    // if (['post', 'put', 'patch'].includes(config.method)) {
    //   if (!config.headers['Content-Type']) {
    //     config.headers['Content-Type'] = 'application/json';
    //   }
    // }


    // config.headers['Accept'] = 'application/json';
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;