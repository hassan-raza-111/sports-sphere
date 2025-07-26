import express from 'express';
import cors from 'cors';
import { connectDB, PORT } from './config.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
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
import cartRoutes from './routes/cart.js';
import paymentRoutes from './routes/payments.js';
import notificationsRoutes from './routes/notifications.js';
import athleteProgressRoutes from './routes/athleteProgress.js';
import payoutRequestsRouter from './routes/payoutRequests.js';
import dotenv from 'dotenv';
import path from 'path';
import { FRONTEND_URL } from './config.js';
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

connectDB();

// Socket.io connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join', (userId) => {
    socket.join(userId);
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} joined room ${userId}`);
  });

  // Handle new message
  socket.on('send_message', async (data) => {
    try {
      const { sender, receiver, content } = data;

      // Save message to database
      const Message = (await import('./models/Message.js')).default;
      const message = new Message({ sender, receiver, content });
      await message.save();

      // Emit to sender
      socket.emit('message_sent', { success: true, message });

      // Emit to receiver if online
      const receiverSocketId = connectedUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiver).emit('new_message', {
          message,
          sender: sender,
        });
      }

      // Emit to sender's room for conversation update
      socket.emit('conversation_updated', { message });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { sender, receiver, isTyping } = data;
    const receiverSocketId = connectedUsers.get(receiver);
    if (receiverSocketId) {
      io.to(receiver).emit('user_typing', { sender, isTyping });
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove user from connected users
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

app.use('/api', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/vendor-profile', vendorProfileRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/coaches', coachesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/progress', athleteProgressRoutes);
app.use('/api/payout-requests', payoutRequestsRouter);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
