import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  metrics: {
    serveAccuracy: Number,
    backhandPower: Number,
    footworkSpeed: Number,
    stamina: Number,
    speed: Number,
    strength: Number,
    focus: Number,
  },
  performance: Number, // overall performance score
  coachNotes: String,
  focusArea: String,
  duration: String, // e.g. '90 min'
  status: {
    type: String,
    enum: ['completed', 'missed', 'upcoming'],
    default: 'completed',
  },
  rating: Number, // session rating
});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
