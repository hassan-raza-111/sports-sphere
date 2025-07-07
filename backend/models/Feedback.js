import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    feedbackType: { type: String, required: true },
    selectedCoach: String,
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: { type: Number, required: true },
    feedbackText: { type: String, required: true },
    email: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
