import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    feedbackType: { type: String, required: true },
    selectedCoach: String,
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    rating: { type: Number, required: true },
    feedbackText: { type: String, required: true },
    email: String,
    date: { type: Date, default: Date.now },
    reply: { type: String },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
