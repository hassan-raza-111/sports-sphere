import express from 'express';
import Coach from '../models/Coach.js';
import Booking from '../models/Booking.js';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

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

// Get upcoming sessions for coach (future, not completed/cancelled)
router.get('/:id/upcoming-sessions', async (req, res) => {
  try {
    const coachId = req.params.id;
    const now = new Date();
    // Only fetch future sessions that are not completed or cancelled
    const bookings = await Booking.find({
      coach: coachId,
      status: { $in: ['pending', 'accepted', 'conducted'] },
      date: { $gte: now.toISOString().split('T')[0] },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get coach dashboard stats (by Coach _id)
router.get('/:id/dashboard-stats', async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    const now = new Date();
    // Upcoming sessions: future bookings (not completed or cancelled)
    const upcomingSessions = await Booking.countDocuments({
      coach: coach._id,
      status: { $in: ['pending', 'accepted', 'conducted'] },
      date: { $gte: now.toISOString().split('T')[0] },
    });
    // Completed sessions
    const completedSessions = await Booking.countDocuments({
      coach: coach._id,
      status: 'completed',
    });
    // Unique athletes
    const allBookings = await Booking.find({ coach: coach._id });
    const totalAthletes = new Set(allBookings.map((b) => String(b.athlete)))
      .size;
    // Average rating
    const feedbacks = await Feedback.find({ selectedCoach: coach._id });
    const avgRating = feedbacks.length
      ? (
          feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) /
          feedbacks.length
        ).toFixed(2)
      : 'N/A';
    // Total earnings: sum of amount for completed bookings
    const completedBookings = await Booking.find({
      coach: coach._id,
      status: 'completed',
    });
    const earnings = completedBookings.reduce(
      (sum, b) => sum + (b.amount || 0),
      0
    );
    res.json({
      upcomingSessions,
      completedSessions,
      totalAthletes,
      avgRating,
      earnings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
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
      'hourlyRate',
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
      const sportRegex = new RegExp(`(^|,| )${sport}(,| |$)`, 'i');
      const sportFilter = {
        $or: [
          { sports: sport }, // exact match (for new data)
          { sports: { $regex: sportRegex } }, // match in comma-separated or spaced list (for old data)
          { specialties: sport },
          { specialties: { $in: [sport] } },
        ],
      };
      if (query.$and) {
        query.$and.push(sportFilter);
      } else if (query.$or) {
        query.$and = [{ $or: query.$or }, sportFilter];
        delete query.$or;
      } else {
        Object.assign(query, sportFilter);
      }
    }

    // Filter by rating
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Filter by availability
    if (available === 'true') {
      const today = new Date()
        .toLocaleDateString('en-US', {
          weekday: 'short',
        })
        .toLowerCase();
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

    // Real stats
    const now = new Date();
    // Upcoming sessions: future bookings
    const upcomingSessions = await Booking.countDocuments({
      coach: coach._id,
      status: {
        $in: ['pending', 'accepted', 'conducted', 'completed', 'captured'],
      },
      date: { $gte: now.toISOString().split('T')[0] },
    });
    // Completed sessions
    const completedSessions = await Booking.countDocuments({
      coach: coach._id,
      status: 'completed',
    });
    // Unique athletes
    const allBookings = await Booking.find({ coach: coach._id });
    const totalAthletes = new Set(allBookings.map((b) => String(b.athlete)))
      .size;
    // Average rating
    const feedbacks = await Feedback.find({ selectedCoach: coach._id });
    const avgRating = feedbacks.length
      ? (
          feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) /
          feedbacks.length
        ).toFixed(2)
      : 'N/A';
    // Total earnings: sum of amount for completed bookings
    const completedBookings = await Booking.find({
      coach: coach._id,
      status: 'completed',
    });
    const earnings = completedBookings.reduce(
      (sum, b) => sum + (b.amount || 0),
      0
    );

    res.json({
      upcomingSessions,
      completedSessions,
      totalAthletes,
      avgRating,
      earnings,
    });
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

// Create sample coaches for testing
router.post('/create-sample', async (req, res) => {
  try {
    const sampleCoaches = [
      {
        userId: new mongoose.Types.ObjectId(),
        name: 'Coach Sarah Williams',
        email: 'sarah.williams@example.com',
        phone: '+1-555-0123',
        sports: 'Tennis',
        sessionType: 'Individual',
        location: 'New York, NY',
        profileImage:
          'https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        about:
          'Former professional tennis player with 5+ years coaching experience. Specializes in technique refinement and competitive strategy.',
        certifications: ['USPTA Certified', 'Tennis Performance Specialist'],
        specialties: ['Technique', 'Strategy', 'Competition'],
        rating: 4.8,
        reviewCount: 128,
        hourlyRate: 75,
        experience: 5,
        isAvailable: true,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
        },
      },
      {
        userId: new mongoose.Types.ObjectId(),
        name: 'Coach David Chen',
        email: 'david.chen@example.com',
        phone: '+1-555-0124',
        sports: 'Football',
        sessionType: 'Group',
        location: 'Los Angeles, CA',
        profileImage:
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        about:
          'NFL certified coach with 7 years experience developing athletes at all levels. Focuses on speed, agility, and game intelligence.',
        certifications: [
          'NFL Certified Coach',
          'Strength & Conditioning Specialist',
        ],
        specialties: ['Speed Training', 'Agility', 'Game Strategy'],
        rating: 5.0,
        reviewCount: 94,
        hourlyRate: 85,
        experience: 7,
        isAvailable: true,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false,
        },
      },
      {
        userId: new mongoose.Types.ObjectId(),
        name: 'Coach Jessica Lee',
        email: 'jessica.lee@example.com',
        phone: '+1-555-0125',
        sports: 'Swimming',
        sessionType: 'Individual',
        location: 'Miami, FL',
        profileImage:
          'https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
        about:
          'Former Olympic swimmer with 10+ years coaching experience. Specializes in stroke technique and endurance training.',
        certifications: ['US Swimming Coach', 'Olympic Coach Certification'],
        specialties: ['Stroke Technique', 'Endurance', 'Competition'],
        rating: 4.2,
        reviewCount: 76,
        hourlyRate: 65,
        experience: 10,
        isAvailable: true,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        },
      },
      {
        userId: new mongoose.Types.ObjectId(),
        name: 'Coach Michael Rodriguez',
        email: 'michael.rodriguez@example.com',
        phone: '+1-555-0126',
        sports: 'Basketball',
        sessionType: 'Group',
        location: 'Chicago, IL',
        profileImage:
          'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        about:
          'Former college basketball player with 8 years coaching experience. Specializes in shooting mechanics and team dynamics.',
        certifications: ['NCAA Coach', 'Basketball Performance Specialist'],
        specialties: ['Shooting', 'Team Play', 'Defense'],
        rating: 4.6,
        reviewCount: 112,
        hourlyRate: 70,
        experience: 8,
        isAvailable: true,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
        },
      },
      {
        userId: new mongoose.Types.ObjectId(),
        name: 'Coach Emma Thompson',
        email: 'emma.thompson@example.com',
        phone: '+1-555-0127',
        sports: 'Athletics',
        sessionType: 'Individual',
        location: 'Austin, TX',
        profileImage:
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        about:
          'Former track and field athlete with 6 years coaching experience. Specializes in sprint training and conditioning.',
        certifications: ['USATF Coach', 'Track & Field Specialist'],
        specialties: ['Sprint Training', 'Conditioning', 'Technique'],
        rating: 4.9,
        reviewCount: 89,
        hourlyRate: 80,
        experience: 6,
        isAvailable: true,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false,
        },
      },
      {
        userId: new mongoose.Types.ObjectId(),
        name: 'Coach Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+1-555-0128',
        sports: 'Boxing',
        sessionType: 'Individual',
        location: 'Las Vegas, NV',
        profileImage:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2020&q=80',
        about:
          'Professional boxing trainer with 12 years experience. Specializes in technique, footwork, and conditioning.',
        certifications: ['Professional Boxing Trainer', 'Fitness Specialist'],
        specialties: ['Technique', 'Footwork', 'Conditioning'],
        rating: 4.7,
        reviewCount: 67,
        hourlyRate: 90,
        experience: 12,
        isAvailable: true,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        },
      },
    ];

    // Clear existing coaches and insert sample data
    await Coach.deleteMany({});
    const createdCoaches = await Coach.insertMany(sampleCoaches);

    res.status(201).json({
      message: 'Sample coaches created successfully',
      count: createdCoaches.length,
      coaches: createdCoaches,
    });
  } catch (error) {
    console.error('Error creating sample coaches:', error);
    res.status(500).json({ message: 'Failed to create sample coaches' });
  }
});

// Get coach profile info, stats, and testimonials by Coach _id
router.get('/profile/by-id/:coachId', async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.coachId);
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

export default router;
