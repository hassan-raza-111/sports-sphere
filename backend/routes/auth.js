import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js';
import Coach from '../models/Coach.js';
import VendorProfile from '../models/VendorProfile.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = express.Router();

// Multer setup for certificates upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join('uploads', 'certificates');
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

// Register
router.post('/register', upload.array('certificates'), async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            role,
            sports,
            sessionType,
            location,
            preferredSport,
            level,
            storeName,
            vendorType,
            website,
        } = req.body;
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Email already registered' });
        const hashed = await bcrypt.hash(password, 10);
        const status = role === 'coach' ? 'disabled' : 'active';
        // Create user
        const user = new User({
            name: fullName,
            email,
            password: hashed,
            role,
            status,
        });
        await user.save();
        // Role-specific logic
        if (role === 'coach') {
            const certificateFiles = req.files ? req.files.map(f => f.path) : [];
            await Coach.create({
                userId: user._id,
                name: fullName,
                sports,
                sessionType,
                location,
                certificates: certificateFiles,
            });
        } else if (role === 'athlete') {
            user.preferredSport = preferredSport;
            user.level = level;
            await user.save();
        } else if (role === 'vendor') {
            await VendorProfile.create({
                userId: user._id,
                storeName,
                vendorType,
                website,
            });
        }
        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });
        if (user.status === 'disabled') {
            return res.status(403).json({ message: 'Your account is disabled. Please wait for admin approval.' });
        }
        res.json({ message: 'Login successful', user: { name: user.name, email: user.email, role: user.role, sport: user.sport, experience: user.experience, status: user.status } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users (for admin user management)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ _id: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user status (activate/deactivate)
router.patch('/users/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'disabled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    try {
        const user = await User.findByIdAndUpdate(id, { status }, { new: true, select: '-password' });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: `User status updated to ${status}`, user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset user password
router.patch('/users/:id/password', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    try {
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.findByIdAndUpdate(id, { password: hashed }, { new: true, select: '-password' });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Password reset successful', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No user with that email' });
        // Generate token
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
        const resetUrl = `http://localhost:5173/reset-password/${token}`;
        const mailOptions = {
            to: user.email,
            from: process.env.GMAIL_USER,
            subject: 'Password Reset',
            html: `<p>You requested a password reset for Sports Sphere.<br/>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`
        };
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Password reset email sent' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required' });
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: 'Password has been reset' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Admin analytics endpoint
router.get('/users/analytics', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'active' });
        const pendingApprovals = await User.countDocuments({ status: 'disabled', role: 'coach' });
        res.json({ totalUsers, activeUsers, pendingApprovals });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 