// keep 1 axios instance for many requests;
import axios from "axios";

export const API_CONFIG = {
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Content-type": "application/json",
    },
    timeout: 10000,
};

const request = axios.create(API_CONFIG);

// Add request interceptor for JWT -  run BEFORE every request is sent.
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // Clear stored tokens
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('refreshToken'); // optional, if stored

            // Redirect to homepage
            if (window.location.pathname !== '/homepage') {
                window.location.href = '/homepage';
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