const express = require('express');
const Auth = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');
const courseController = require('../controllers/courseController');
const { registerUser, getWishlist,logoutUser,loginUser,searchCourses,Profile,changePassword} = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', Auth,logoutUser);
router.post('/logo', Auth,  authorizeRole(['admin', 'instructor']),logoutUser);
router.get('/getwish', Auth, getWishlist);
router.get('/profile', Auth,Profile);
router.get('/admin',Auth, authorizeRole(['admin', 'instructor']),Profile);
router.get('/s',Auth,searchCourses); // Prot
router.put('/change-password', Auth, changePassword);

module.exports = router;
    