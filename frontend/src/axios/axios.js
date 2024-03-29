import axios from 'axios';

let API_BASE_URL = 'https://rentechke.onrender.com/api/v1'

API_BASE_URL = 'http://localhost:4000/api/v1'; 

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
 
  withCredentials: true,

});
