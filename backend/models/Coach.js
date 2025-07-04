import mongoose from 'mongoose';

const coachSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    sports: String,
    sessionType: String,
    location: String,
    certificates: [String],
}, { timestamps: true });

const Coach = mongoose.model('Coach', coachSchema);
export default Coach; 