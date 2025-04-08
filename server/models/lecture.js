const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  video: { type: String, required: true }, // URL or path to video
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Reference to course
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Creator of the lecture
}, { timestamps: true });
const Lecture = mongoose.models.Lecture || mongoose.model('Lecture', lectureSchema);

module.exports = Lecture;