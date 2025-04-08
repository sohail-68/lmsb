import Progclient from '../api/Progclient';

export const getProgress = async (courseId) => {
  const response = await Progclient.get(`/progress?courseId=${courseId}`);
  console.log(response);
  
  return response.data;
};

export const updateProgress = async (courseId, lectureId) => {
  const response = await Progclient.post('/progress', { courseId, lectureId });
  return response.data;
};
