import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    feedbackType: { type: String, required: true },
    selectedCoach: String,
    rating: { type: Number, required: true },
    feedbackText: { type: String, required: true },
    email: String,
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback; 