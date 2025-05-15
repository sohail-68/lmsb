import axios from 'axios';

const API_URL = 'learningm-production.up.railway.app/api/quizzes';

// ✅ Function to get token from local storage
const getAuthToken = () => {
  return localStorage.getItem('token'); // Adjust based on your auth system
};

// ✅ Configure headers with Authorization token
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`, // Attach Bearer token
  },
});

// ✅ Fetch quizzes for a course
export const getQuizzesByCourse = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, authHeaders());
  console.log(response);
  
  return response.data;
};

// ✅ Submit a quiz attempt
export const submitQuiz = async (quizId, answers) => {
  const response = await axios.post(`${API_URL}/${quizId}/submit`, { answers }, authHeaders());
  return response.data;
};

// ✅ Create a new quiz (Admin/Instructor Only)
export const createQuiz = async (courseId, quizData) => {
  const response = await axios.post(`${API_URL}/${courseId}`, quizData, authHeaders());
  return response.data;
};

export const getQuizzesByTitle = async (title) => {
  const response = await axios.get(`${API_URL}/quizzes/title?title=${title}`);
  return response.data;
};