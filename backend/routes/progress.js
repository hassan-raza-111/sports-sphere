import express from 'express';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// Get progress for a user
router.get('/', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'Missing userId' });
  try {
    const progress = await Progress.find({ userId }).sort({ date: 1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add progress
router.post('/', async (req, res) => {
  let { userId, metrics } = req.body;
  console.log('Received progress data:', { userId, metrics });

  // Handle case where userId might be an object
  if (typeof userId === 'object' && userId._id) {
    userId = userId._id;
  }

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  // Validate metrics
  if (!metrics || typeof metrics !== 'object') {
    metrics = {};
  }

  // Ensure metrics have proper structure
  const validMetrics = {
    stamina: Number(metrics.stamina) || 0,
    speed: Number(metrics.speed) || 0,
    strength: Number(metrics.strength) || 0,
    focus: Number(metrics.focus) || 0,
    serveAccuracy: Number(metrics.serveAccuracy) || 0,
    backhandPower: Number(metrics.backhandPower) || 0,
    footworkSpeed: Number(metrics.footworkSpeed) || 0,
  };

  // Validate metric values (0-100)
  Object.keys(validMetrics).forEach((key) => {
    if (validMetrics[key] < 0) validMetrics[key] = 0;
    if (validMetrics[key] > 100) validMetrics[key] = 100;
  });

  console.log('Validated metrics:', validMetrics);

  try {
    // Create a new progress document for each session
    const progress = new Progress({
      userId,
      metrics: validMetrics,
      date: new Date(),
    });
    await progress.save();
    res.status(201).json({ message: 'Progress saved', progress });
  } catch (err) {
    console.error('Error saving progress:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get goal progress (percentage) for an athlete
router.get('/athlete/:id/goal-progress', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.goals) return res.json({ goalProgress: 0 });
    const total = user.goals.length;
    if (total === 0) return res.json({ goalProgress: 0 });
    const completed = user.goals.filter((g) => g.status === 'completed').length;
    const progress = Math.round((completed / total) * 100);
    res.json({ goalProgress: progress });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch goal progress' });
  }
});

// List athletes for a specific coach (only those who have had sessions with this coach)
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
    const athletes = await User.find(
      { _id: { $in: athleteIds }, role: 'athlete' },
      'name _id preferredSport profileImage'
    );

    res.json(athletes);
  } catch (err) {
    console.error('Error fetching athletes for coach:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get overview stats for athlete
router.get('/athlete/:id/overview', async (req, res) => {
  try {
    const userId = req.params.id;
    const sessions = await Progress.find({ userId });
    const completed = sessions.filter((s) => s.status === 'completed');
    const attendance = sessions.length
      ? (completed.length / sessions.length) * 100
      : 0;
    const avgPerformance = completed.length
      ? completed.reduce((sum, s) => sum + (s.performance || 0), 0) /
        completed.length
      : 0;
    const goalCompletion = 87; // Placeholder, can be calculated from goals
    res.json({
      completedSessions: completed.length,
      goalCompletion,
      avgPerformance: avgPerformance.toFixed(1),
      attendance: attendance.toFixed(1),
      trendSessions: 20, // Placeholder
      trendGoal: 5, // Placeholder
      trendPerformance: 0.3, // Placeholder
      trendAttendance: -3, // Placeholder
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get session history for athlete
router.get('/athlete/:id/history', async (req, res) => {
  try {
    const userId = req.params.id;
    const history = await Progress.find({ userId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get metrics over time for chart
router.get('/athlete/:id/metrics', async (req, res) => {
  try {
    const userId = req.params.id;
    const progress = await Progress.find({ userId }).sort({ date: 1 });
    const labels = progress.map((p) => p.date.toISOString().slice(0, 10));
    const serveAccuracy = progress.map((p) => p.metrics.serveAccuracy || 0);
    const backhandPower = progress.map((p) => p.metrics.backhandPower || 0);
    const footworkSpeed = progress.map((p) => p.metrics.footworkSpeed || 0);
    const stamina = progress.map((p) => p.metrics.stamina || 0);
    res.json({ labels, serveAccuracy, backhandPower, footworkSpeed, stamina });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all progress for athlete
router.get('/athlete/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const progress = await Progress.find({ userId }).sort({ date: 1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get latest metrics summary for athlete
router.get('/athlete/:id/metrics-summary', async (req, res) => {
  try {
    const userId = req.params.id;
    // Get all progress records for this user, sorted by createdAt (most recent first)
    const allProgress = await Progress.find({ userId }).sort({ createdAt: -1 });
    if (!allProgress.length) {
      return res.json({ stamina: 0, speed: 0, strength: 0, focus: 0 });
    }
    // Get the latest record (first in the array since we sorted by createdAt: -1)
    const latest = allProgress[0];
    // Defensive: Check if metrics exists and is an object
    if (!latest.metrics || typeof latest.metrics !== 'object') {
      return res.json({ stamina: 0, speed: 0, strength: 0, focus: 0 });
    }
    const {
      stamina = 0,
      speed = 0,
      strength = 0,
      focus = 0,
    } = latest.metrics || {};
    res.json({ stamina, speed, strength, focus });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch metrics summary' });
  }
});

// Get metrics trend for athlete (for chart)
router.get('/athlete/:id/metrics-trend', async (req, res) => {
  try {
    const userId = req.params.id;
    const progress = await Progress.find({ userId })
      .sort({ date: 1 })
      .limit(10);
    const labels = progress.map((p) => p.date.toISOString().slice(0, 10));
    const stamina = progress.map((p) => p.metrics?.stamina || 0);
    const speed = progress.map((p) => p.metrics?.speed || 0);
    const strength = progress.map((p) => p.metrics?.strength || 0);
    const focus = progress.map((p) => p.metrics?.focus || 0);
    res.json({ labels, stamina, speed, strength, focus });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch metrics trend' });
  }
});

// Cleanup endpoint to remove incorrect progress documents
router.delete('/cleanup', async (req, res) => {
  try {
    // Remove all progress documents that have incorrect metrics structure
    const result = await Progress.deleteMany({
      $or: [
        { metrics: { $exists: false } },
        { 'metrics.status': { $exists: true } }, // Documents with wrong structure
        { 'metrics.date': { $exists: true } }, // Documents with wrong structure
      ],
    });

    console.log('Cleanup completed. Removed documents:', result.deletedCount);
    res.json({
      message: 'Cleanup completed',
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error('Error in cleanup:', err);
    res.status(500).json({ error: 'Failed to cleanup' });
  }
});

export default router;
