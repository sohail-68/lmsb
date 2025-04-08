const express = require('express');
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCoursesByCreator,
  getLecturesForCourse,
  Fetchall,
  verifyPayment,
  Userdata,
  addToWishlist,
  review,
  getbyId,
  getAllPaymentsFromRazorpay,
  deleteAllPayments
  // getwish,

} = require('../controllers/courseController');
const protect = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');
const router = express.Router();
const upload = require('../middlewares/upload');  // Path to the multer middleware
// Admin and Instructor APIs
router.post('', protect, authorizeRole(['admin', 'instructor']), upload.single('courseThumbnail'),   createCourse); // Admins/Instructors can create courses
router.put('/:id', protect, authorizeRole(['admin', 'instructor']), upload.single('courseThumbnail'),updateCourse); // Admins/Instructors can update courses
router.delete('/:id', protect, authorizeRole(['admin']), deleteCourse); // Only Admins can delete courses
router.get('/admin', protect, authorizeRole(['admin']), getCourses); // Admins can view all coursesFetchall
router.get('/a', protect, authorizeRole(['admin']), Fetchall); // Admins can view all coursesFetchall
router.get('/userdata', protect, authorizeRole(['admin']), Userdata); // Admins can view all coursesFetchall
router.get('/pay', protect, authorizeRole(['admin']),getAllPaymentsFromRazorpay); // Users can view a single course
router.get('/delpay', protect,authorizeRole(['admin']), deleteAllPayments); // Users can view a single course
// User APIs
router.get('/', protect, getCourses); // Users can view all published courses
router.get('/:id', protect, getCourseById); // Users can view a single course
router.post('/:id/enroll', protect, enrollInCourse); // Users can enroll in a course
router.post('/verify-payment', protect,  verifyPayment); // Users can enroll in a course
router.get('/my-courses', protect,  getCoursesByCreator); // Users can view courses they are enrolled in
router.get('/courseId/lectures', protect, getLecturesForCourse); // Prot
router.post('/:id/review', protect, review); // Prot
router.post('/:id/wishlist', protect, addToWishlist); // Prot
// router.get('/getwish', protect, getwish); // Prot
router.get('/detail/:id', protect, getbyId); // Prot

module.exports = router;
