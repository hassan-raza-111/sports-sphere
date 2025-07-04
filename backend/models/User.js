import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User; 