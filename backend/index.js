import express from 'express';
import cors from 'cors';
import { connectDB, PORT } from './config.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/booking.js';
import feedbackRoutes from './routes/feedback.js';
import orderRoutes from './routes/order.js';
import vendorProfileRoutes from './routes/vendorProfile.js';
import messagesRoutes from './routes/messages.js';
import progressRoutes from './routes/progress.js';
import reportsRoutes from './routes/reports.js';
import coachesRoutes from './routes/coaches.js';
import productsRoutes from './routes/products.js';
import notificationsRoutes from './routes/notifications.js';
import athleteProgressRoutes from './routes/athleteProgress.js';
import Coach from './models/Coach.js';
import Notification from './models/Notification.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Seed sample coaches data
const seedCoaches = async () => {
  try {
    const existingCoaches = await Coach.countDocuments();
    if (existingCoaches === 0) {
      const sampleCoaches = [
        {
          name: 'Coach Sarah Williams',
          email: 'sarah.williams@example.com',
          phone: '+1-555-0123',
          sports: 'Tennis',
          location: 'New York, NY',
          rating: 4.8,
          reviewCount: 128,
          hourlyRate: 75,
          experience: 5,
          about:
            'Former professional tennis player with 5+ years coaching experience. Specializes in technique refinement and competitive strategy.',
          specialties: [
            'Technique Refinement',
            'Competitive Strategy',
            'Mental Game',
          ],
          profileImage:
            'https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
          isAvailable: true,
        },
        {
          name: 'Coach David Chen',
          email: 'david.chen@example.com',
          phone: '+1-555-0124',
          sports: 'Football',
          location: 'Los Angeles, CA',
          rating: 5.0,
          reviewCount: 94,
          hourlyRate: 85,
          experience: 7,
          about:
            'NFL certified coach with 7 years experience developing athletes at all levels. Focuses on speed, agility, and game intelligence.',
          specialties: ['Speed Training', 'Agility', 'Game Intelligence'],
          profileImage:
            'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
          isAvailable: true,
        },
        {
          name: 'Coach Jessica Lee',
          email: 'jessica.lee@example.com',
          phone: '+1-555-0125',
          sports: 'Swimming',
          location: 'Miami, FL',
          rating: 4.2,
          reviewCount: 76,
          hourlyRate: 65,
          experience: 10,
          about:
            'Former Olympic swimmer with 10+ years coaching experience. Specializes in stroke technique and endurance training.',
          specialties: [
            'Stroke Technique',
            'Endurance Training',
            'Competition Prep',
          ],
          profileImage:
            'https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
          isAvailable: true,
        },
        {
          name: 'Coach Michael Johnson',
          email: 'michael.johnson@example.com',
          phone: '+1-555-0126',
          sports: 'Basketball',
          location: 'Chicago, IL',
          rating: 4.6,
          reviewCount: 112,
          hourlyRate: 70,
          experience: 8,
          about:
            'Former college basketball player with 8 years coaching experience. Specializes in shooting mechanics and team dynamics.',
          specialties: [
            'Shooting Mechanics',
            'Team Dynamics',
            'Defensive Strategy',
          ],
          profileImage:
            'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
          isAvailable: true,
        },
        {
          name: 'Coach Maria Rodriguez',
          email: 'maria.rodriguez@example.com',
          phone: '+1-555-0127',
          sports: 'Soccer',
          location: 'Houston, TX',
          rating: 4.9,
          reviewCount: 89,
          hourlyRate: 80,
          experience: 6,
          about:
            'Former professional soccer player with 6 years coaching experience. Specializes in ball control and tactical awareness.',
          specialties: [
            'Ball Control',
            'Tactical Awareness',
            'Fitness Training',
          ],
          profileImage:
            'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
          isAvailable: true,
        },
      ];

      await Coach.insertMany(sampleCoaches);
      console.log('Sample coaches seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding coaches:', error);
  }
};

// Seed sample notifications
const seedNotifications = async () => {
  try {
    const existingNotifications = await Notification.countDocuments();
    if (existingNotifications === 0) {
      // Get a sample athlete ID (you'll need to create one or use an existing one)
      const sampleNotifications = [
        {
          recipient: '507f1f77bcf86cd799439011', // Sample athlete ID
          recipientType: 'athlete',
          message:
            'Your booking with Coach Sarah has been confirmed for tomorrow at 2:00 PM',
          type: 'booking',
          read: false,
        },
        {
          recipient: '507f1f77bcf86cd799439011',
          recipientType: 'athlete',
          message:
            "Great progress on your tennis skills! You've improved by 15% this month.",
          type: 'progress',
          read: false,
        },
        {
          recipient: '507f1f77bcf86cd799439011',
          recipientType: 'athlete',
          message:
            'New equipment available in the marketplace - check out the latest tennis rackets!',
          type: 'system',
          read: true,
        },
        {
          recipient: '507f1f77bcf86cd799439011',
          recipientType: 'athlete',
          message:
            'Coach David has sent you a message about your upcoming session.',
          type: 'message',
          read: false,
        },
        {
          recipient: '507f1f77bcf86cd799439011',
          recipientType: 'athlete',
          message:
            'Congratulations! You have completed 10 sessions this month.',
          type: 'achievement',
          read: false,
        },
      ];

      await Notification.insertMany(sampleNotifications);
      console.log('Sample notifications seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding notifications:', error);
  }
};

// Run seeding after database connection
setTimeout(() => {
  seedCoaches();
  seedNotifications();
}, 2000);

app.use('/api', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/vendor-profile', vendorProfileRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/coaches', coachesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/progress', athleteProgressRoutes);

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
