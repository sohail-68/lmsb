const Progress = require("../models/Progress");
const Lecture = require("../models/Lecture");

exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.query;
    const userId = req.user.id; // Assume `req.user` contains the authenticated user

    // Fetch progress
    const progress = await Progress.findOne({
      user: userId,
      course: courseId,
    }).populate("completedLectures", "title");

    // If no progress exists, return an empty progress structure
    if (!progress) {
      const totalLectures = await Lecture.countDocuments({ course: courseId });
      return res.status(200).json({
        completedCount: 0,
        totalLectures,
        progressPercentage: 0,
        completedLectures: [],
      });
    }

    const totalLectures = await Lecture.countDocuments({ course: courseId });
    const completedCount = progress.completedLectures.length;

    res.status(200).json({
      completedCount,
      totalLectures,
      progressPercentage: ((completedCount / totalLectures) * 100).toFixed(2),
      completedLectures: progress.completedLectures,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch progress", error: error.message });
  }
};

exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const userId = req.user.id; // Assume `req.user` contains the authenticated user
console.log("a",courseId,lectureId);

    // Fetch or create progress record
    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: courseId,
        completedLectures: [lectureId],
      });
    } else if (!progress.completedLectures.includes(lectureId)) {
      progress.completedLectures.push(lectureId);
      console.log("d");
      
      await progress.save();
    }

    // Calculate progress
    const totalLectures = await Lecture.countDocuments({ course: courseId });
    const completedCount = progress.completedLectures.length;

    res.status(200).json({
      message: "Progress updated successfully",
      completedCount,
      totalLectures,
      progressPercentage: ((completedCount / totalLectures) * 100).toFixed(2),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update progress", error: error.message });
  }
};
