import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Coach from './models/Coach.js';
import VendorProfile from './models/VendorProfile.js';
import Booking from './models/Booking.js';
import Cart from './models/Cart.js';
import Feedback from './models/Feedback.js';
import Message from './models/Message.js';
import Notification from './models/Notification.js';
import Order from './models/Order.js';
import PayoutRequest from './models/PayoutRequest.js';
import Product from './models/Product.js';
import Progress from './models/Progress.js';
import Report from './models/Report.js';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/sports-sphere';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear all collections
    await Promise.all([
      User.deleteMany({}),
      Coach.deleteMany({}),
      VendorProfile.deleteMany({}),
      Booking.deleteMany({}),
      Cart.deleteMany({}),
      Feedback.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      Order.deleteMany({}),
      PayoutRequest.deleteMany({}),
      Product.deleteMany({}),
      Progress.deleteMany({}),
      Report.deleteMany({}),
    ]);
    console.log('All collections cleared.');

    // Create default admin user
    const adminPassword = await bcrypt.hash('11223344', 10);
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: adminPassword,
      role: 'admin',
      status: 'active',
    });
    await adminUser.save();
    console.log('Default admin user created: admin@gmail.com / 11223344');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
