import express from 'express';
import User from '../models/User.js';
import Coach from '../models/Coach.js';
import Booking from '../models/Booking.js';
import Order from '../models/Order.js';
import Report from '../models/Report.js';

const router = express.Router();

// Get platform analytics overview
router.get('/analytics/overview', async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const twoMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      now.getDate()
    );

    // Current month stats
    const currentMonthStats = await Promise.all([
      User.countDocuments({ createdAt: { $gte: lastMonth } }),
      User.countDocuments({ role: 'athlete', createdAt: { $gte: lastMonth } }),
      User.countDocuments({ role: 'coach', createdAt: { $gte: lastMonth } }),
      Booking.countDocuments({ createdAt: { $gte: lastMonth } }),
    ]);

    // Previous month stats for comparison
    const previousMonthStats = await Promise.all([
      User.countDocuments({
        createdAt: { $gte: twoMonthsAgo, $lt: lastMonth },
      }),
      User.countDocuments({
        role: 'athlete',
        createdAt: { $gte: twoMonthsAgo, $lt: lastMonth },
      }),
      User.countDocuments({
        role: 'coach',
        createdAt: { $gte: twoMonthsAgo, $lt: lastMonth },
      }),
      Booking.countDocuments({
        createdAt: { $gte: twoMonthsAgo, $lt: lastMonth },
      }),
    ]);

    // Calculate percentage changes
    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const analytics = {
      newSignups: {
        count: currentMonthStats[0],
        trend: calculatePercentageChange(
          currentMonthStats[0],
          previousMonthStats[0]
        ),
      },
      activeAthletes: {
        count: await User.countDocuments({ role: 'athlete', status: 'active' }),
        trend: calculatePercentageChange(
          currentMonthStats[1],
          previousMonthStats[1]
        ),
      },
      activeCoaches: {
        count: await User.countDocuments({ role: 'coach', status: 'active' }),
        trend: calculatePercentageChange(
          currentMonthStats[2],
          previousMonthStats[2]
        ),
      },
      activeVendors: {
        count: await User.countDocuments({ role: 'vendor', status: 'active' }),
        // For now, set trend to 0 (or you can implement similar to above if needed)
        trend: 0,
      },
      sessionsBooked: {
        count: currentMonthStats[3],
        trend: calculatePercentageChange(
          currentMonthStats[3],
          previousMonthStats[3]
        ),
      },
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Get user growth chart data
router.get('/analytics/user-growth', async (req, res) => {
  try {
    const { timeframe = 'month' } = req.query;
    const now = new Date();
    let labels = [];
    let newUsersData = [];
    let activeUsersData = [];

    switch (timeframe) {
      case 'week':
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
          const startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - i * 7
          );
          const endDate = new Date(
            startDate.getTime() + 7 * 24 * 60 * 60 * 1000
          );

          const newUsers = await User.countDocuments({
            createdAt: { $gte: startDate, $lt: endDate },
          });
          const activeUsers = await User.countDocuments({
            lastActive: { $gte: startDate, $lt: endDate },
          });

          labels.push(`Week ${4 - i}`);
          newUsersData.push(newUsers);
          activeUsersData.push(activeUsers);
        }
        break;

      case 'month':
        // Last 6 months
        for (let i = 5; i >= 0; i--) {
          const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const endDate = new Date(
            now.getFullYear(),
            now.getMonth() - i + 1,
            1
          );

          const newUsers = await User.countDocuments({
            createdAt: { $gte: startDate, $lt: endDate },
          });
          const activeUsers = await User.countDocuments({
            lastActive: { $gte: startDate, $lt: endDate },
          });

          labels.push(
            startDate.toLocaleDateString('en-US', { month: 'short' })
          );
          newUsersData.push(newUsers);
          activeUsersData.push(activeUsers);
        }
        break;

      case 'quarter':
        // Last 5 quarters
        for (let i = 4; i >= 0; i--) {
          const quarter = Math.floor((now.getMonth() - i * 3) / 3);
          const year = now.getFullYear() - Math.floor((i * 3) / 12);
          const startDate = new Date(year, quarter * 3, 1);
          const endDate = new Date(year, (quarter + 1) * 3, 1);

          const newUsers = await User.countDocuments({
            createdAt: { $gte: startDate, $lt: endDate },
          });
          const activeUsers = await User.countDocuments({
            lastActive: { $gte: startDate, $lt: endDate },
          });

          labels.push(`Q${quarter + 1} ${year}`);
          newUsersData.push(newUsers);
          activeUsersData.push(activeUsers);
        }
        break;

      case 'year':
        // Last 6 years
        for (let i = 5; i >= 0; i--) {
          const year = now.getFullYear() - i;
          const startDate = new Date(year, 0, 1);
          const endDate = new Date(year + 1, 0, 1);

          const newUsers = await User.countDocuments({
            createdAt: { $gte: startDate, $lt: endDate },
          });
          const activeUsers = await User.countDocuments({
            lastActive: { $gte: startDate, $lt: endDate },
          });

          labels.push(year.toString());
          newUsersData.push(newUsers);
          activeUsersData.push(activeUsers);
        }
        break;
    }

    res.json({
      labels,
      datasets: [
        {
          label: 'New Users',
          data: newUsersData,
        },
        {
          label: 'Active Users',
          data: activeUsersData,
        },
      ],
    });
  } catch (error) {
    console.error('Error fetching user growth data:', error);
    res.status(500).json({ error: 'Failed to fetch user growth data' });
  }
});

// Get activity breakdown by sport
router.get('/analytics/sport-breakdown', async (req, res) => {
  try {
    const { timeframe = 'month' } = req.query;
    const now = new Date();
    let startDate;

    switch (timeframe) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        break;
      case 'quarter':
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate()
        );
        break;
    }

    // Aggregate bookings by sport, only for accepted/conducted/completed/captured
    const sportBreakdown = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['accepted', 'conducted', 'completed', 'captured'] },
        },
      },
      {
        $lookup: {
          from: 'coaches',
          localField: 'coach',
          foreignField: '_id',
          as: 'coach',
        },
      },
      { $unwind: '$coach' },
      {
        $group: {
          _id: '$coach.sports',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const total = sportBreakdown.reduce((sum, sport) => sum + sport.count, 0);
    const labels = sportBreakdown.map((sport) => sport._id || 'Other');
    const data = sportBreakdown.map((sport) => sport.count);

    res.json({
      labels,
      data,
      total,
    });
  } catch (error) {
    console.error('Error fetching sport breakdown:', error);
    res.status(500).json({ error: 'Failed to fetch sport breakdown data' });
  }
});

// Get recent sessions
router.get('/analytics/recent-sessions', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recentSessions = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['accepted', 'conducted', 'completed', 'captured'] },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'athlete',
          foreignField: '_id',
          as: 'athlete',
        },
      },
      {
        $lookup: {
          from: 'coaches',
          localField: 'coach',
          foreignField: '_id',
          as: 'coach',
        },
      },
      { $unwind: '$athlete' },
      { $unwind: '$coach' },
      {
        $lookup: {
          from: 'users',
          localField: 'coach.userId',
          foreignField: '_id',
          as: 'coachUser',
        },
      },
      { $unwind: '$coachUser' },
      {
        $project: {
          date: '$createdAt',
          athlete: '$athlete.name',
          coach: '$coachUser.name',
          sport: '$coach.sports',
          duration: '$duration',
          rating: '$rating',
          status: '$status',
          paymentStatus: '$paymentStatus',
          amount: '$amount',
        },
      },
      { $sort: { date: -1 } },
      { $limit: parseInt(limit) },
    ]);

    res.json(recentSessions);
  } catch (error) {
    console.error('Error fetching recent sessions:', error);
    res.status(500).json({ error: 'Failed to fetch recent sessions' });
  }
});

// TEST ROUTE: Add a test booking for recent sessions
router.post('/analytics/add-test-booking', async (req, res) => {
  try {
    const { athleteId, coachId, coachUserId } = req.body;
    const Booking = require('../models/Booking');
    const Coach = require('../models/Coach');

    // Make sure coach exists and has correct userId
    let coach = await Coach.findById(coachId);
    if (!coach) {
      coach = await Coach.create({
        userId: coachUserId,
        name: 'Test Coach',
        sports: 'Football',
      });
    }

    const booking = new Booking({
      athlete: athleteId,
      coach: coach._id,
      date: new Date().toISOString().slice(0, 10),
      time: '10:00',
      notes: 'Test session',
      amount: 2000,
      paymentStatus: 'captured',
      status: 'completed',
    });
    await booking.save();
    res.json({ message: 'Test booking created!', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get open reports count
router.get('/open-count', async (req, res) => {
  try {
    const openCount = await Report.countDocuments({ status: 'open' });
    res.json({ openCount });
  } catch (error) {
    console.error('Error fetching open reports count:', error);
    res.status(500).json({ error: 'Failed to fetch open reports count' });
  }
});

// Get all reports with filters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate('reportedBy', 'name email')
        .populate('reportedUser', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Report.countDocuments(filter),
    ]);

    res.json({
      reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Update report status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const report = await Report.findByIdAndUpdate(
      id,
      {
        status,
        adminNotes,
        resolvedAt: status === 'resolved' ? new Date() : null,
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ error: 'Failed to update report status' });
  }
});

export default router;
