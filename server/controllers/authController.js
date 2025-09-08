const Course = require('../models/Course');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};
   
// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Create a new user
    const user = await User.create({ name, email, password });

    // Respond with a token and user details
    res.status(201).json({ token: generateToken(user.id), user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isComparePassword = await user.comparePassword(password);
    if (!isComparePassword) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    

    // Respond with a token and user details
    res.status(200).json({ token: generateToken(user.id), user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
// Backend logout API (Express)
exports.logoutUser = async(req, res) => {
  
  try {
    // If you're storing JWT tokens in cookies, you can clear the cookie.
    // res.clearCookie('token', { httpOnly: true, secure: true }); // Uncomment if you are using cookies
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid user.' });
    }

    // Inform the user they have been logged out (In case you need session management, blacklisting, etc.)
    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};



// Fetch Profile
exports.Profile = async (req, res) => {
  try {
    // Fetch user by ID (assumes req.user.id is populated by Auth middleware)
    const user = await User.findById(req.user.id).populate({
      path: 'enrolledCourses',
      select: '-enrolledUsers', 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Search Courses
exports.searchCourses = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term query parameter is required." });
    }

    const courses = await Course.find({
      title: { $regex: searchTerm, $options: 'i' }, // 'i' for case-insensitive
    }).exec();

    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found matching the title." });
    }

    return res.status(200).json({ courses });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { id } = req.user;  

    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required." });
    }

    // Fetch user from the database, including the password field
    const user = await User.findById(id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await user.comparePassword(oldPassword); 

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    user.password = newPassword;

    await user.save();


    

    res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    // Find all courses where the user is in the wishlistUsers array
    const wishlistCourses = await Course.find({ wishlistUsers: req.user.id })
      .populate("wishlistUsers") // Populate wishlist user details if needed

    // If no courses are found in the wishlist
    if (!wishlistCourses.length) {
      return res.status(404).json({ message: "No courses found in your wishlist" });
    }

    res.status(200).json({
      message: "Wishlist retrieved successfully",
      courses: wishlistCourses,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving wishlist', error: error.message });
  }
};



