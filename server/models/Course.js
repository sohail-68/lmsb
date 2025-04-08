const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Additional Fields
  courseLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  coursePrice: {
    type: Number,
    default: 0, // Free by default
  },
  courseThumbnail: {
    type: String,
  },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  discount: {
    type: Number, // Percentage discount
    default: 0,
  },
  prerequisites: [{}],

  language: {
    type: String,
    default: 'English',
  },
  certificates: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      issuedAt: { type: Date, default: Date.now },
      certificateURL: { type: String },
    },
  ],
  progressTracking: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      progress: { type: Number, default: 0 }, // Percentage of course completion
      lastUpdated: { type: Date, default: Date.now },
    },
  ],
  wishlistUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notifications: [
    {
      message: { type: String },
      sentAt: { type: Date, default: Date.now },
    },
  ],
  analytics: {
    enrollments: { type: Number, default: 1, min: 1 },   // Ensure enrollments starts from 1 or more
    completionRate: { type: Number, default: 0 },
    averageRating: { type: Number, min: 1, max: 5, default: 1 },  // Default value is 1, which satisfies min: 1
  },
}, { timestamps: true });
mongoose.set("strictPopulate",false)

module.exports = mongoose.model('Course', courseSchema);

