import axios from 'axios';
const baseURL = import.meta.env.VITE_BACKEND_URL || '';

export const auth = axios.create({
    baseURL: `${baseURL}/api/auth`,
    withCredentials: true
});

export const admin = axios.create({
    baseURL: `${baseURL}/api/admin`,
    withCredentials: true
});

export const employee = axios.create({
    baseURL: `${baseURL}/api/employee`,
    withCredentials: true
});

export const api = axios.create({
    baseURL: `${baseURL}/api`,
    withCredentials: true
});