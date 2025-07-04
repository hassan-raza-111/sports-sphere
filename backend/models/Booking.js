import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    coach: { type: String, required: true },
    athlete: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: String,
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking; 