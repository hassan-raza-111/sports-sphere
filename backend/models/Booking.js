import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    coach: { type: String, required: true },
    athlete: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
