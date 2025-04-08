import axios from 'axios';

const BASE_URL = 'http://localhost:5000/lecture';

/**
 * Fetch lectures for a specific course
 * @param {string} courseId - The ID of the course
 * @param {string} token - User's authentication token
 * @returns {Promise<Array>} - Array of lectures
 */
export const getLecturesForCourse = async (courseId, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the fetched lectures
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch lectures');
  }
};

export const getLectureById = async (id,token) => {
  try {
    const response = await axios.get(`${BASE_URL}/lecture/${id}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return lecture data
  } catch (error) {
    console.error('Error fetching lecture:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

export const Update = async (lectureId, formData, token) => {
  console.log(lectureId, formData, token);
  
  const response = await axios.put(`http://localhost:5000/lecture/${lectureId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
