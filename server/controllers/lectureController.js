const Lecture = require('../models/lecture');
const Course = require('../models/Course');
const lecture = require('../models/lecture');


// Create a new lecture
exports.createLecture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Video file is required.' });
    }

    const { title, description, courseId } = req.body;

    const lecture = new Lecture({
      title,
      description,
      video: req.file.path, // Path to the uploaded file
      course: courseId,
      createdBy: req.user._id, // Replace with the actual user ID logic
    });

    await lecture.save();

    res.status(201).json({ message: 'Lecture created successfully', lecture });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create lecture' });
  }
}


// Get all lectures for a specific course
exports.getLecturesForCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const lectures = await Lecture.find({ course: courseId }).populate('createdBy', 'name email');
    if (!lectures) {
      return res.status(404).json({ message: 'No lectures found for this course' });
    }
    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lectures', error: error.message });
  }
};

exports.Fetchall = async (req, res) => {
  try {
    // Fetch all lectures and populate related fields
    const lectures = await Lecture.find({})
      .populate('createdBy', 'name email') // Populate 'createdBy' with specific fields
      .populate('course', 'name description'); // Populate 'course' with specific fields

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


// Get a specific lecture by ID
exports.getLectureById = async (req, res) => {
  const { id } = req.params;

  try {
    const lecture = await Lecture.findById(id).populate('createdBy', 'name email');
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.status(200).json(lecture);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lecture', error: error.message });
  }
};

// Update a lecture
exports.updateLecture = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    // Check if the lecture exists and the user is authorized to update it
    const lecture = await Lecture.findOne({ _id: id, createdBy: req.user._id });

    if (!lecture) {
      return res.status(404).json({ 
        message: 'Lecture not found or you are not authorized to update this lecture' 
      });
    }

    // Prepare updated fields
    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (req.file && req.file.path) updatedFields.video = req.file.path;

    // Update lecture
    const updatedLecture = await Lecture.findOneAndUpdate(
      { _id: id, createdBy: req.user._id }, // Ensure consistent use of `req.user._id`
      { $set: updatedFields },
      { new: true } // Return the updated document
    );

    if (!updatedLecture) {
      return res.status(500).json({ message: 'Failed to update lecture' });
    }

    res.status(200).json(updatedLecture);
  } catch (error) {
    console.error('Error updating lecture:', error);
    res.status(500).json({ 
      message: 'Error updating lecture', 
      error: error.message 
    });
  }
};


// Delete a lecture
exports.deleteLecture = async (req, res) => {
  const { id } = req.params;

  try {
    const lecture = await Lecture.findById(id);

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    // Only allow the creator of the lecture to delete it
    if (lecture.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this lecture' });
    }

    await lecture.remove();

    // Remove the lecture from the course's lecture list
    const course = await Course.findById(lecture.course);
    course.lectures.pull(lecture._id);
    await course.save();

    res.status(200).json({ message: 'Lecture deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lecture', error: error.message });
  }
};
