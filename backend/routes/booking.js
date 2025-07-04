import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// Create a new booking
router.post('/', async (req, res) => {
    const { coach, athlete, date, time, notes } = req.body;
    if (!coach || !athlete || !date || !time) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const booking = new Booking({ coach, athlete, date, time, notes });
        await booking.save();
        res.status(201).json({ message: 'Booking created', booking });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 