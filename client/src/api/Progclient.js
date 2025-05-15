import axios from 'axios';

const Prog = axios.create({
  baseURL: 'learningm-production.up.railway.app/progress', // Update to your API's base URL
});

// Automatically attach token if it exists
Prog.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Replace with your token storage mechanism
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Prog;
