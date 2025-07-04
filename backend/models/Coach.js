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
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    hourlyRate: { type: Number, default: 0 },
    availability: {
      monday: { type: Boolean, default: true },
      tuesday: { type: Boolean, default: true },
      wednesday: { type: Boolean, default: true },
      thursday: { type: Boolean, default: true },
      friday: { type: Boolean, default: true },
      saturday: { type: Boolean, default: true },
      sunday: { type: Boolean, default: true },
    },
    experience: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
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
