// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://lmsb-apt8.onrender.com/api', // Replace with your backend URL
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});


export default apiClient;
