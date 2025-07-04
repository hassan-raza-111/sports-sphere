import express from 'express';
import Coach from '../models/Coach.js';
import Booking from '../models/Booking.js';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

const router = express.Router();

// Get all coaches
router.get('/', async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.json(coaches);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a coach
router.post('/', async (req, res) => {
  const { name, specialty, rating, reviews, bio, image } = req.body;
  if (!name || !specialty || !rating || !reviews || !bio || !image) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const coach = new Coach({ name, specialty, rating, reviews, bio, image });
    await coach.save();
    res.status(201).json({ message: 'Coach added', coach });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get upcoming sessions for coach (next 7 days)
router.get('/:id/upcoming-sessions', async (req, res) => {
  try {
    const coachId = req.params.id;
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    // Booking.date is string, so we need to filter by ISO string
    const bookings = await Booking.find({
      coach: coachId,
      status: { $in: ['pending', 'completed'] },
    });
    // Filter in JS for date range
    const sessions = bookings.filter((b) => {
      const d = new Date(b.date);
      return d >= now && d <= nextWeek;
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get coach dashboard stats
router.get('/:id/dashboard-stats', async (req, res) => {
  try {
    const coachId = req.params.id;
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    // Upcoming sessions count
    const bookings = await Booking.find({
      coach: coachId,
      status: { $in: ['pending', 'completed'] },
    });
    const upcomingSessions = bookings.filter((b) => {
      const d = new Date(b.date);
      return d >= now;
    }).length;
    // Average rating
    const feedbacks = await Feedback.find({ selectedCoach: coachId });
    const avgRating = feedbacks.length
      ? (
          feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) /
          feedbacks.length
        ).toFixed(2)
      : 'N/A';
    // Athlete retention (athletes with >1 session in last 30 days / total athletes)
    const monthAgo = new Date();
    monthAgo.setDate(now.getDate() - 30);
    const recentBookings = bookings.filter((b) => {
      const d = new Date(b.date);
      return d >= monthAgo && d <= now;
    });
    const athleteIds = [...new Set(bookings.map((b) => b.athlete))];
    const retainedAthletes = [...new Set(recentBookings.map((b) => b.athlete))];
    const retention = athleteIds.length
      ? ((retainedAthletes.length / athleteIds.length) * 100).toFixed(0)
      : '0';
    // New athletes (created in last 7 days)
    const newAthletes = await User.countDocuments({
      role: 'athlete',
      createdAt: { $gte: weekAgo },
    });
    res.json({
      upcomingSessions,
      avgRating,
      retention,
      newAthletes,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get coach profile info, stats, and testimonials
router.get('/:id/profile', async (req, res) => {
  try {
    const coach = await Coach.findOne({ userId: req.params.id });
    if (!coach) return res.status(404).json({ message: 'Coach not found' });
    // Stats
    const now = new Date();
    const monthAgo = new Date();
    monthAgo.setDate(now.getDate() - 30);
    const allBookings = await Booking.find({ coach: coach._id });
    const athletesTrained = [...new Set(allBookings.map((b) => b.athlete))]
      .length;
    const sessionsThisMonth = allBookings.filter((b) => {
      const d = new Date(b.date);
      return d >= monthAgo && d <= now;
    }).length;
    // Avg rating
    const feedbacks = await Feedback.find({ selectedCoach: coach._id });
    const avgRating = feedbacks.length
      ? (
          feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) /
          feedbacks.length
        ).toFixed(2)
      : 'N/A';
    // Retention: athletes with >1 session in last 30 days / total athletes
    const recentBookings = allBookings.filter((b) => {
      const d = new Date(b.date);
      return d >= monthAgo && d <= now;
    });
    const retainedAthletes = [...new Set(recentBookings.map((b) => b.athlete))];
    const retentionRate = athletesTrained
      ? ((retainedAthletes.length / athletesTrained) * 100).toFixed(0)
      : '0';
    // Testimonials: feedbacks with text and rating
    const testimonials = feedbacks
      .filter((f) => f.feedbackText && f.rating)
      .map((f) => ({
        athlete: f.athlete,
        rating: f.rating,
        feedbackText: f.feedbackText,
      }));
    res.json({
      ...coach.toObject(),
      stats: {
        athletesTrained,
        avgRating,
        retentionRate,
        sessionsThisMonth,
      },
      testimonials,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update coach profile by userId
router.put('/:id/profile', async (req, res) => {
  try {
    const updates = req.body;
    // Only allow updating certain fields for security
    const allowedFields = [
      'name',
      'email',
      'phone',
      'sports',
      'sessionType',
      'location',
      'profileImage',
      'about',
      'certifications',
      'specialties',
    ];
    const updateData = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) updateData[key] = updates[key];
    }
    const coach = await Coach.findOneAndUpdate(
      { userId: req.params.id },
      { $set: updateData },
      { new: true }
    );
    if (!coach) return res.status(404).json({ message: 'Coach not found' });
    res.json({ message: 'Profile updated', coach });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all coaches for find coaches page
router.get('/find', async (req, res) => {
  try {
    const { search, sport, rating, available } = req.query;

    let query = { isAvailable: true };

    // Search by name, sports, or location
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sports: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { specialties: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Filter by sport
    if (sport && sport !== 'All Sports') {
      query.sports = { $regex: sport, $options: 'i' };
    }

    // Filter by rating
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Filter by availability
    if (available === 'true') {
      const today = new Date().toLocaleDateString('en-US', {
        weekday: 'lowercase',
      });
      query[`availability.${today}`] = true;
    }

    const coaches = await Coach.find(query)
      .populate('userId', 'name email')
      .select(
        'name sports location rating reviewCount hourlyRate experience about profileImage specialties'
      )
      .sort({ rating: -1, reviewCount: -1 });

    res.json(coaches);
  } catch (error) {
    console.error('Error fetching coaches:', error);
    res.status(500).json({ message: 'Failed to fetch coaches' });
  }
});

// Get coach by ID
router.get('/:id', async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id).populate('userId');
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    res.json(coach);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch coach' });
  }
});

// Get coach profile by userId
router.get('/profile/:userId', async (req, res) => {
  try {
    const coach = await Coach.findOne({ userId: req.params.userId }).populate(
      'userId'
    );
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    res.json(coach);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch coach profile' });
  }
});

// Get coach dashboard stats
router.get('/:userId/dashboard-stats', async (req, res) => {
  try {
    const coach = await Coach.findOne({ userId: req.params.userId });
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    // Mock data for now - in real app, calculate from bookings and feedback
    const stats = {
      upcomingSessions: Math.floor(Math.random() * 10) + 5,
      avgRating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
      retention: Math.floor(Math.random() * 30) + 70, // 70% to 100%
      newAthletes: Math.floor(Math.random() * 5) + 1,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

// Update coach profile
router.put('/:userId', async (req, res) => {
  try {
    const coach = await Coach.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    res.json(coach);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update coach profile' });
  }
});

export default router;
