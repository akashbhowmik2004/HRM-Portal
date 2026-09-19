import axios from 'axios';

export const auth = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
});

export const admin = axios.create({
    baseURL: "http://localhost:3000/api/admin",
    withCredentials: true
});

export const employee = axios.create({
    baseURL: "http://localhost:3000/api/employee",
    withCredentials: true
});

export const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
});