import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coach',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    metrics: {
      stamina: { type: Number, min: 0, max: 100, default: 0 },
      speed: { type: Number, min: 0, max: 100, default: 0 },
      strength: { type: Number, min: 0, max: 100, default: 0 },
      focus: { type: Number, min: 0, max: 100, default: 0 },
      serveAccuracy: { type: Number, min: 0, max: 100, default: 0 },
      backhandPower: { type: Number, min: 0, max: 100, default: 0 },
      footworkSpeed: { type: Number, min: 0, max: 100, default: 0 },
    },
    performance: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    coachNotes: {
      type: String,
      default: '',
    },
    focusArea: {
      type: String,
      default: 'General',
    },
    duration: {
      type: String,
      default: '60 min',
    },
    status: {
      type: String,
      enum: ['completed', 'missed', 'upcoming'],
      default: 'completed',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to ensure metrics are properly formatted
progressSchema.pre('save', function (next) {
  // Ensure metrics is an object
  if (!this.metrics || typeof this.metrics !== 'object') {
    this.metrics = {};
  }

  // Ensure all metric fields exist with default values
  const defaultMetrics = {
    stamina: 0,
    speed: 0,
    strength: 0,
    focus: 0,
    serveAccuracy: 0,
    backhandPower: 0,
    footworkSpeed: 0,
  };

  // Merge with existing metrics, ensuring all fields exist
  this.metrics = { ...defaultMetrics, ...this.metrics };

  next();
});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
