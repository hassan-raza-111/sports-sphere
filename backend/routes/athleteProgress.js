import express from 'express';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Progress from '../models/Progress.js';

const router = express.Router();

// 1. Get athletes for a specific coach (only those who have had sessions with this coach)
router.get('/athletes', async (req, res) => {
  try {
    const { coachId } = req.query;

    if (!coachId) {
      return res.status(400).json({ message: 'Coach ID is required' });
    }

    // Find all bookings for this coach to get athlete IDs
    const bookings = await Booking.find({ coach: coachId });
    const athleteIds = [...new Set(bookings.map((booking) => booking.athlete))];

    if (athleteIds.length === 0) {
      return res.json([]);
    }

    // Get athlete details for those who have had sessions with this coach
    const athletes = await User.find({
      _id: { $in: athleteIds },
      role: 'athlete',
    }).select('name sport profileImage');

    res.json(athletes);
  } catch (err) {
    console.error('Error fetching athletes for coach:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. Athlete progress overview
router.get('/athletes/:id/progress-overview', async (req, res) => {
  const athleteId = req.params.id;
  // Completed sessions
  const completedSessions = await Progress.countDocuments({
    userId: athleteId,
    status: 'completed',
  });
  // Goal completion (dummy for now)
  const goalCompletion = 80;
  // Average performance
  const progress = await Progress.find({ userId: athleteId });
  const avgPerformance = progress.length
    ? (
        progress.reduce((sum, p) => sum + (p.performance || 0), 0) /
        progress.length
      ).toFixed(1)
    : 0;
  // Attendance rate (dummy for now)
  const attendanceRate = 90;
  // Trends (dummy for now)
  res.json({
    completedSessions,
    goalCompletion,
    avgPerformance,
    attendanceRate,
    trends: { sessions: 20, goals: 5, performance: 0.3, attendance: -3 },
  });
});

// 3. Athlete progress chart
router.get('/athletes/:id/progress-chart', async (req, res) => {
  const progress = await Progress.find({ userId: req.params.id }).sort({
    date: 1,
  });
  res.json({
    labels: progress.map((p) =>
      p.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    ),
    technical: progress.map((p) => p.metrics?.technical || 0),
    physical: progress.map((p) => p.metrics?.physical || 0),
    mental: progress.map((p) => p.metrics?.mental || 0),
  });
});

// 4. Athlete key metrics
router.get('/athletes/:id/metrics', async (req, res) => {
  const progress = await Progress.find({ userId: req.params.id })
    .sort({ date: -1 })
    .limit(1);
  const latest = progress[0] || {};
  res.json([
    { title: 'Serve Accuracy', value: latest.metrics?.serveAccuracy || 0 },
    { title: 'Backhand Power', value: latest.metrics?.backhandPower || 0 },
    { title: 'Footwork Speed', value: latest.metrics?.footworkSpeed || 0 },
    { title: 'Stamina', value: latest.metrics?.stamina || 0 },
  ]);
});

// 5. Athlete session history
router.get('/athletes/:id/sessions', async (req, res) => {
  const { coachId } = req.query;
  const filter = {
    userId: req.params.id,
    status: { $in: ['completed', 'missed', 'upcoming'] },
  };
  if (coachId) filter.coach = coachId;
  const sessions = await Progress.find(filter).sort({ date: -1 }).limit(20);
  const table = sessions.map((s) => ({
    date: s.date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    duration: s.duration || '60 min',
    focus: s.focusArea || 'General',
    performance: s.performance || 0,
    coachNotes: s.coachNotes || '-',
    status: s.status,
  }));
  res.json(table);
});

export default router;
