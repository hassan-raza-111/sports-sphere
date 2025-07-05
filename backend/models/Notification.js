import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'recipientType',
    },
    recipientType: {
      type: String,
      required: true,
      enum: ['athlete', 'coach', 'vendor', 'admin'],
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'general',
      enum: ['booking', 'progress', 'feedback', 'system', 'general'],
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking', // Can be booking, progress, etc.
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ recipient: 1, recipientType: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
