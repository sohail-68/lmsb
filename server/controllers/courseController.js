const Course = require('../models/Course');
const Lecture = require('../models/lecture');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { log } = require('console');
// Controller for creating a course

const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_pVQpC22qnKIhBQ', // Your Razorpay public key
  key_secret: 'X67fjCrIoXIPaHeIwWaIE5yi', // Your Razorpay secret key
});

exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      courseLevel,
      coursePrice,
      discount,
      language,
      progressTracking,
      wishlistUsers,
      prerequisites,
      certificates,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !courseLevel || !coursePrice) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Parse JSON fields safely


    // Ensure the file upload for the thumbnail exists
    if (!req.file) {
      return res.status(400).json({ message: 'Course thumbnail is required' });
    }
console.log("file",req.file);

    // Normalize file path for the course thumbnail
    const normalizedThumbnailPath = req.file.path.replace(/\\/g, '/');
console.log(normalizedThumbnailPath,"nomral");
console.log(req.file,"file");

    // Create new course object
    const newCourse = new Course({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      courseLevel: courseLevel.trim(),
      coursePrice: parseFloat(coursePrice),
      discount: discount ? parseFloat(discount) : 0,
      language: language.trim(),
      courseThumbnail: normalizedThumbnailPath,
      prerequisites,
      progressTracking,
      wishlistUsers,
      certificates
    });

    // Save the course to the database
    await newCourse.save();

    // Return the newly created course
    return res.status(201).json({
      message: 'Course created successfully',
      course: {
        id: newCourse._id,
        title: newCourse.title,
        category: newCourse.category,
        courseLevel: newCourse.courseLevel,
        coursePrice: newCourse.coursePrice,
        discount: newCourse.discount,
        language: newCourse.language,
        prerequisites: newCourse.prerequisites,
        thumbnail: normalizedThumbnailPath,
      },
    });
  } catch (err) {
    console.error('Error creating course:', err); // Improved logging
    return res.status(500).json({
      message: 'Error creating course',
      error: err.message,
    });
  }
};


// Admin: Get all courses
exports.getCourses = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { published: true }; // Admin sees all, users see published only
    const courses = await Course.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User/Admin: Get a single course by ID
exports.getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id).populate('createdBy', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (req.user.role !== 'admin' && !course.published) {
      return res.status(403).json({ message: 'Access denied. Course is not published.' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getbyId= async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('createdBy lectures  reviews.user prerequisites');
    console.log(course,);
    
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  console.log("Updating course with ID:", id);

  const { title, description,discount, category,language,wishlistUsers, prerequisites,courseLevel, coursePrice } = req.body;
  const courseThumbnail = req.file ? req.file.path : null; // Get the file path if a new thumbnail is uploaded

  try {
    const updateFields = {};
    if (title) updateFields.title = title;
    if (discount) updateFields.discount = discount;
    if (language) updateFields.language = language;
    if (prerequisites) updateFields.prerequisites = prerequisites;
    if (description) updateFields.description = description;
    if (category) updateFields.category = category;
    if (courseLevel) updateFields.courseLevel = courseLevel;
    if (coursePrice) updateFields.coursePrice = coursePrice;
    if (courseThumbnail) updateFields.courseThumbnail = courseThumbnail;

    // Update the course in a single query
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated document and validate updates
    );
console.log("pre1",prerequisites);

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check user role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Lecture.deleteMany({ course: id });

    await course.remove();

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.Userdata = async (req, res) => {
  try {
    // Find courses with at least one enrolled user
    const courses = await Course.find({ enrolledUsers: { $exists: true, $ne: [] } })
      .populate("enrolledUsers"); // Populate enrolledUsers with desired fields

    // Send the filtered courses as response
    res.status(200).send({ data: courses });
  } catch (error) {
    console.error("Error fetching courses with enrolled users:", error);
    res.status(500).send({ message: "Server error" });
  }
};


// User: Enroll in a course


exports.enrollInCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    const user = await User.findById(req.user.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the user is already enrolled
    if (course.enrolledUsers.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // If the course is paid, create a Razorpay order
    if (course.coursePrice > 0) {
      const orderOptions = {
        amount: course.coursePrice * 100, // Convert to paisa (1 INR = 100 paisa)
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1, // Automatically capture the payment
      };

      const order = await razorpayInstance.orders.create(orderOptions);

      // Return Razorpay order ID for payment
      return res.json({
        orderId: order.id,
        courseId: course._id,
        coursePrice: course.coursePrice,
        name: course.title,
      });
    }

    // For free courses, directly enroll the user
    course.enrolledUsers.push(req.user.id);
    course.analytics.enrollments += 1;
    user.enrolledCourses.push(course._id);
    
    await course.save();
    await user.save();

    res.json({ message: 'Successfully enrolled in the course', course });
  } catch (error) {
    console.error('Enrollment Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.verifyPayment = async (req, res) => {
  const { paymentId, orderId, signature, courseId } = req.body;

  try {
    // Fetch the course and user
    const course = await Course.findById(courseId);
    const user = await User.findById(req.user.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac('sha256', razorpayInstance.key_secret)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Check if the user is already enrolled in the course
    if (!course.enrolledUsers.includes(req.user.id)) {
      course.enrolledUsers.push(req.user.id);
      course.analytics.enrollments += 1;
      user.enrolledCourses.push(course._id);
      
      await course.save();
      await user.save();
    }

    // Log the payment information in the database
    const payment = new Payment({
      paymentId: paymentId,
      orderId: orderId,
      signature: signature,
      course: course._id,  // Corrected to use 'course' instead of 'courseId'
      user: user._id,      // Corrected to use 'user' instead of 'userId'
      amount: course.coursePrice,  // Assuming `coursePrice` contains the amount
      status: 'success',   // Status set to 'success' after successful verification
    });

    await payment.save();

    res.json({ message: 'Payment verified and enrollment successful!' });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.getAllPaymentsFromRazorpay = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Fetch all payments from the database
    const payments = await Payment.find()
      .populate('course') // Populate course details (title and price)
      .populate('user') // Populate user details (name and email)
      .exec();

    // If no payments are found, return a message
    if (payments.length === 0) {
      return res.status(404).json({ message: 'No payments found' });
    }

    // Return the aggregated payments data
    res.json({
      success: true,
      payments: payments.map(payment => ({
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.createdAt,
        course: payment.course ? {
          title: payment.course.title,
          price: payment.course.coursePrice,
          image: payment.course.courseThumbnail,
        } : null,
        user: payment.user ? {
          name: payment.user.name,
          email: payment.user.email,
        } : null,
      })),
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.deleteAllPayments = async (req, res) => {
  try {
    // Authorization (optional): Ensure only authorized users can delete payments
    // Example: Check if the user is an admin
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ success: false, message: 'Unauthorized access' });
    // }

    // Delete payments from the Payment collection
    const deletedPayments = await Payment.deleteMany({});

    // Optionally: Clear related data (e.g., updates in Course/User if needed)
    // await Course.updateMany({}, { $unset: { razorpayOrderId: '' } });
    // await User.updateMany({}, { $unset: { razorpayPaymentId: '' } });

    res.json({
      success: true,
      message: `${deletedPayments.deletedCount} payments deleted successfully.`,
    });
  } catch (error) {
    console.error('Error deleting payments:', error);
    res.status(500).json({ success: false, message: 'Error deleting payments' });
  }
};

// User: Get courses created by the logged-in user
exports.getCoursesByCreator = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.Fetchall = async (req, res) => {
  try {
    // Fetch all lectures and populate related fields
    const lectures = await Lecture.find({})

    // Respond with the list of lectures
    res.status(200).json({ 
      message: 'Lectures fetched successfully', 
      lectures 
    });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res.status(500).json({ 
      error: 'Unable to fetch lectures', 
      details: error.message 
    });
  }
};


// Get lectures for a specific course
exports.getLecturesForCourse = async (req, res) => {

  try {
    // Find the course by ID and populate the 'lectures' field
    const course = await Course.find({}).populate('lectures'); // populate lectures

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Send the lectures data as part of the course data
    res.status(200).json({
      course: {
        title: course.title,
        description: course.description,
        lectures: course.lectures,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lectures', error: error.message });
  }
};
exports.review= async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const existingReview = course.reviews.find(review => review.user.toString() === req.user.id.toString());
    if (existingReview) return res.status(400).json({ message: 'You have already reviewed this course' });

    const review = { user: req.user.id, rating, comment };
    course.reviews.push(review);

    const totalRatings = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    course.analytics.averageRating = totalRatings / course.reviews.length;

    await course.save();
    
    res.json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ** Add to wishlist **
exports.addToWishlist = async (req, res) => {
  try {
    // Find the course by ID
    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the user is already in the wishlist
    const userIndex = course.wishlistUsers.indexOf(req.user.id);

    if (userIndex === -1) {
      // User not in wishlist, add them
      course.wishlistUsers.push(req.user.id);
      await course.save();
      return res.status(200).json({ message: 'Added to wishlist', course });
    } else {
      // User in wishlist, remove them
      course.wishlistUsers.splice(userIndex, 1);
      await course.save();
      return res.status(200).json({ message: 'Removed from wishlist', course });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error processing wishlist', error: error.message });
  }
};

// exports.getwish = async (req, res) => {
//   try {
//     const finduser = await Course.find().populate("wishlistUsers");
//     res.json(finduser);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

