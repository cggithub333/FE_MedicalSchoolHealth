// keep 1 axios instance for many requests;
import axios from "axios";

export const API_CONFIG = {
    JSON_SERVER_API: {
        baseURL: "http://localhost:3000",
        timeout: 10 * 1000, // 10secs
    },
};

const request = axios.create(API_CONFIG.JSON_SERVER_API);

// Add request interceptor for JWT -  run BEFORE every request is sent.
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for handling token expiration - run AFTER every request receives a response
request.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await request.post('/auth/refresh-token', { refreshToken });
                const { token } = response.data;

                // Store new token
                localStorage.setItem('token', token);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return request(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default request;


/*
Cuong's explaination:  these "request.interceptors.response" or "request.interceptors.request" objects have a 'use' function which only take callbacks function 
                    ~ like a template for using later (for every request sent)
*/