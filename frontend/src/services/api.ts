import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:5173"
});

const token = localStorage.getItem('authtoken');

if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export { api };