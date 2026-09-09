import axios from 'axios';

export const auth = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
});

export const admin = axios.create({
    baseURL: "http://localhost:3000/api/admin",
    withCredentials: true
});