import axios from "axios"
// import { AxiosResponse, AxiosError } from "axios" // Types are not needed in JS files

const baseURL = "http://localhost:8080"

export const api = axios.create({
  baseURL: baseURL,
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  }
});

// Interceptor để thêm token vào header của mỗi request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if(token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor để xử lý response
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Xử lý lỗi 401 (Unauthorized)
        if (error.response?.status === 401) {
            // Xóa token khỏi localStorage
            localStorage.removeItem("token");
            // Chuyển hướng về trang login
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);