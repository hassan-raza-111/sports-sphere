import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    sport: String,
    experience: String,
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
    preferredSport: String,
    level: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    phone: String,
    location: String,
    about: String,
    profileImage: String,
    age: Number,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    philosophy: String,
    achievements: [
      {
        year: String,
        title: String,
        description: String,
      },
    ],
    goals: [
      {
        goal: String,
        status: {
          type: String,
          enum: ['in progress', 'completed', 'not started'],
          default: 'not started',
        },
        progress: { type: Number, default: 0 }, // percent
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
