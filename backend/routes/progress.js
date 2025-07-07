import express from 'express';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

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
  const { userId, metrics } = req.body;
  if (!userId || !metrics)
    return res.status(400).json({ message: 'Missing required fields' });
  try {
    const progress = new Progress({ userId, metrics });
    await progress.save();
    res.status(201).json({ message: 'Progress added', progress });
  } catch (err) {
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

// List all athletes
router.get('/athletes', async (req, res) => {
  try {
    const athletes = await User.find(
      { role: 'athlete' },
      'name _id preferredSport'
    );
    res.json(athletes);
  } catch (err) {
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
    const latest = await Progress.find({ userId }).sort({ date: -1 }).limit(1);
    if (!latest.length)
      return res.json({ stamina: 0, speed: 0, strength: 0, focus: 0 });
    const {
      stamina = 0,
      speed = 0,
      strength = 0,
      focus = 0,
    } = latest[0].metrics || {};
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

export default router;
