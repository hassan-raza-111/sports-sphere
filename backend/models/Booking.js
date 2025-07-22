import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coach',
      required: true,
    },
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: String,
    amount: { type: Number, required: true }, // Add amount field
    paymentIntentId: { type: String },
    paymentStatus: {
      type: String,
      enum: [
        'pending',
        'authorized',
        'captured',
        'failed',
        'refunded',
        'cancelled',
      ],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'conducted', 'completed', 'cancelled'],
      default: 'pending',
    },
    // Additional fields for tracking
    acceptedAt: { type: Date },
    rejectedAt: { type: Date },
    capturedAt: { type: Date },
    refundedAt: { type: Date },
    refundId: { type: String },
    refundReason: { type: String },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
