import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Get messages between two users
router.get('/', async (req, res) => {
    const { sender, receiver } = req.query;
    if (!sender || !receiver) {
        return res.status(400).json({ message: 'Missing sender or receiver' });
    }
    try {
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
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
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 