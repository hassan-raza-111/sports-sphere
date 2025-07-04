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
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

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

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`)); 