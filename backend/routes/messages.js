import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// Get all users for starting new conversations (filtered by role)
router.get('/users/:currentUserId/:role', async (req, res) => {
  const { currentUserId, role } = req.params;
  try {
    // Get users with opposite role (athletes for coaches, coaches for athletes)
    const oppositeRole = role === 'athlete' ? 'coach' : 'athlete';
    const users = await User.find({
      _id: { $ne: currentUserId },
      role: oppositeRole,
      status: 'active',
    }).select('name email profileImage role');

    res.json(users);
  } catch (err) {
    console.error('Error getting users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get conversations for a user (list of people they've messaged with)
router.get('/conversations/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ timestamp: -1 });

    // Group messages by conversation partner
    const conversations = {};
    const userPromises = [];

    messages.forEach((message) => {
      const partnerId =
        message.sender === userId ? message.receiver : message.sender;
      if (!conversations[partnerId]) {
        conversations[partnerId] = {
          lastMessage: message,
          unreadCount: 0,
        };
        userPromises.push(
          User.findById(partnerId).select('name email profileImage role')
        );
      }

      // Count unread messages (messages received by current user that are not read)
      if (message.receiver === userId && !message.read) {
        conversations[partnerId].unreadCount++;
      }
    });

    // Get user details for all conversation partners
    const users = await Promise.all(userPromises);
    const userMap = {};
    users.forEach((user) => {
      if (user) userMap[user._id.toString()] = user;
    });

    // Format conversations
    const formattedConversations = Object.keys(conversations)
      .map((partnerId) => {
        const conversation = conversations[partnerId];
        const partner = userMap[partnerId];
        if (!partner) return null;

        return {
          partnerId: partnerId,
          partnerName: partner.name,
          partnerEmail: partner.email,
          partnerImage: partner.profileImage,
          partnerRole: partner.role,
          lastMessage: conversation.lastMessage.content,
          lastMessageTime: conversation.lastMessage.timestamp,
          unreadCount: conversation.unreadCount,
        };
      })
      .filter(Boolean);

    res.json(formattedConversations);
  } catch (err) {
    console.error('Error getting conversations:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages between two users
router.get('/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error getting messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/', async (req, res) => {
  const { sender, receiver, content } = req.body;
  if (!sender || !receiver || !content) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const message = new Message({ sender, receiver, content });
    await message.save();
    res.status(201).json({ message: 'Message sent', messageObj: message });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.put('/mark-read/:senderId/:receiverId', async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    // Mark messages as read where receiver is the current user
    await Message.updateMany(
      {
        sender: { $in: [senderId, receiverId] },
        receiver: senderId, // Only mark messages received by current user
        read: false,
      },
      { read: true }
    );

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

export default router;
