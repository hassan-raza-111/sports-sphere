import express from 'express';
import Report from '../models/Report.js';

const router = express.Router();

// Get reports by type
router.get('/', async (req, res) => {
    const { type } = req.query;
    try {
        const query = type ? { type } : {};
        const reports = await Report.find(query).sort({ date: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a report
router.post('/', async (req, res) => {
    const { type, data } = req.body;
    if (!type || !data) return res.status(400).json({ message: 'Missing required fields' });
    try {
        const report = new Report({ type, data });
        await report.save();
        res.status(201).json({ message: 'Report added', report });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get count of open reports
router.get('/open-count', async (req, res) => {
    try {
        const openCount = await Report.countDocuments({ status: 'open' });
        res.json({ openCount });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 