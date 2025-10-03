// import axios from "axios";

// import axiosInstance from "./axiosInstance"; 

// function HttpClient() {
//   return {
//     get: axiosInstance.get,
//     post: axiosInstance.post,
//     patch: axiosInstance.patch,
//     put: axiosInstance.put,
//     delete: axiosInstance.delete,
//     postWithoutToken: (url, data) => axios.post(url, data),
//     getWithoutToken: (url) => axios.get(url),
//     putDetailsCofiguration: (url, data) => console.log(url,data) && axios.put(url,data),
//   };
// }

// export default HttpClient();

import axios from "axios";
import axiosInstance from "./axiosInstance";

const HttpClient = {
    get: (url, config) => axiosInstance.get(url, config),
    post: (url, data, config) => axiosInstance.post(url, data, config),
    patch: (url, data, config) => axiosInstance.patch(url, data, config),
    put: (url, data, config) => axiosInstance.put(url, data, config),
    delete: (url, config) => axiosInstance.delete(url, config),

    // Sans interceptors (utile pour endpoints publics externes)
    postWithoutToken: (url, data, config) => axios.post(url, data, config),
    getWithoutToken: (url, config) => axios.get(url, config),

    // Ton utilitaire custom conservé
    putDetailsCofiguration: (url, data) => {
        console.log(url, data);
        return axios.put(url, data);
    },
};

export default HttpClient;