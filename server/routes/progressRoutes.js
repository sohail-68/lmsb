const express = require('express');
const Auth = require('../middlewares/authMiddleware');
const router = express.Router();
const progressController = require('../controllers/progressController');

router.get('/progress',Auth, progressController.getCourseProgress);
router.post('/progress',Auth, progressController.updateCourseProgress);

module.exports = router;
