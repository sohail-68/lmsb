// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'learningm-production.up.railway.app/api', // Replace with your backend URL
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});


export default apiClient;
