const express = require('express');
const { 
  createLecture, 
  getLecturesForCourse, 
  getLectureById, 
  updateLecture, 
  deleteLecture ,
  Fetchall
} = require('../controllers/lectureController');
const authorizeRole = require('../middlewares/roleMiddleware');
const authenticate = require('../middlewares/authMiddleware'); // Middleware to authenticate user
const upload = require('../middlewares/multerConfig'); // Multer configuration
const router = express.Router();

// Create a lecture - Only 'admin' or 'instructor' can create
router.post('/', authenticate, authorizeRole(['admin', 'instructor']), upload.single('video'), createLecture);

// Get all lectures for a specific course - 'admin', 'instructor', or 'student' can view
router.get('/:courseId', authenticate, authorizeRole(['admin', 'instructor', 'student']), getLecturesForCourse);
router.get('/all', authenticate, authorizeRole(['admin', 'instructor', 'student']), Fetchall);

// Get a specific lecture by ID - 'admin', 'instructor', or 'student' can view
router.get('/lecture/:id', authenticate, authorizeRole(['admin', 'instructor', 'student']), getLectureById);

// Update a lecture - Only 'admin' or the lecture creator (instructor) can update
router.put('/lecture/:id', authenticate, authorizeRole(['admin', 'instructor']),upload.single('video'), updateLecture);

// Delete a lecture - Only 'admin' or the lecture creator (instructor) can delete
router.delete('/lecture/:id', authenticate, authorizeRole(['admin', 'instructor']), deleteLecture);
// In your route handler, you might have something like this


module.exports = router;
