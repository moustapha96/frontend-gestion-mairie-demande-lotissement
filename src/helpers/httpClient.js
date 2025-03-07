import axios from "axios";

import axiosInstance from "./axiosInstance"; 

function HttpClient() {
  return {
    get: axiosInstance.get,
    post: axiosInstance.post,
    patch: axiosInstance.patch,
    put: axiosInstance.put,
    delete: axiosInstance.delete,
    postWithoutToken: (url, data) => axios.post(url, data),
    getWithoutToken: (url) => axios.get(url),
    putDetailsCofiguration: (url, data) => console.log(url,data) && axios.put(url,data),
  };
}

export default HttpClient();