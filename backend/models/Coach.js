import mongoose from 'mongoose';

const coachSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    sports: String,
    sessionType: String,
    location: String,
    certificates: [String],
    profileImage: { type: String },
    about: { type: String },
    certifications: [String],
    specialties: [String],
    stats: {
      athletesTrained: { type: Number, default: 0 },
      avgRating: { type: Number, default: 0 },
      retentionRate: { type: Number, default: 0 },
      sessionsThisMonth: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Coach = mongoose.model('Coach', coachSchema);
export default Coach;
