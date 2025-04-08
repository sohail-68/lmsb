const express = require('express');
const { createQuiz, getQuizzesByCourse, submitQuiz,getQuizzesByTitle } = require('../controllers/quizController');
const protect = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

const router = express.Router();

// Create a quiz (Admin/Instructor Only)
router.post('/:courseId', protect, authorizeRole(['admin', 'instructor']), createQuiz);
router.get('/quizzes/title', getQuizzesByTitle);
// Get quizzes for a specific course
router.get('/:courseId', protect, getQuizzesByCourse);

// Submit quiz (User)
router.post('/:quizId/submit', protect, submitQuiz);

module.exports = router;
