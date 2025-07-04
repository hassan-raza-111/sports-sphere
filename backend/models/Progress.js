import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    metrics: { type: Object, required: true },
    date: { type: Date, default: Date.now }
});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress; 