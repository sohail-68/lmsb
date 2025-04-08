const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    orderId: {
      type: String,
      required: true, // Razorpay Order ID
    },
    paymentId: {
      type: String, // Razorpay Payment ID
    },
    signature: {
      type: String, // Razorpay Signature for verification
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    
    amount: {
      type: Number,
      required: true,
    },
    receipt: {
      type: String, // Optional receipt ID
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
