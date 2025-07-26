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
import { FRONTEND_URL } from '../config.js';

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
    // Normalize email (lowercase and trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Check for existing user with case-insensitive email
    const existing = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') },
    });

    if (existing) {
      console.log('Email already exists:', existing.email);
      return res.status(409).json({ message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const status = role === 'coach' ? 'disabled' : 'active';
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    // Create user
    const user = new User({
      name: fullName,
      email,
      password: hashed,
      role,
      status,
      verificationToken,
      isEmailVerified: false,
    });
    await user.save();
    // Role-specific logic
    if (role === 'coach') {
      const certificateFiles = req.files ? req.files.map((f) => f.path) : [];
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
    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    const verifyUrl = `${FRONTEND_URL}/verify-email/${verificationToken}`;
    const mailOptions = {
      to: user.email,
      from: process.env.GMAIL_USER,
      subject: 'Verify your email for Sports Sphere',
      html: `<p>Thank you for registering at Sports Sphere.<br/>Please <a href="${verifyUrl}">click here</a> to verify your email and activate your account.</p>`,
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json({
      message:
        'Registration successful. Please check your email to verify your account.',
    });
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
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message:
          'An invite has been sent to your email. Please accept it to continue.',
      });
    }
    if (user.status === 'disabled') {
      return res.status(403).json({
        message: 'Your account is disabled. Please wait for admin approval.',
      });
    }
    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        sport: user.sport,
        experience: user.experience,
        status: user.status,
      },
    });
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
    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, select: '-password' }
    );
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
    const user = await User.findByIdAndUpdate(
      id,
      { password: hashed },
      { new: true, select: '-password' }
    );
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
    if (!user)
      return res.status(404).json({ message: 'No user with that email' });
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
    const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;
    const mailOptions = {
      to: user.email,
      from: process.env.GMAIL_USER,
      subject: 'Password Reset',
      html: `<p>You requested a password reset for Sports Sphere.<br/>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
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
  if (!password)
    return res.status(400).json({ message: 'Password is required' });
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: 'Invalid or expired token' });
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
    const pendingApprovals = await User.countDocuments({
      status: 'disabled',
      role: 'coach',
    });
    res.json({ totalUsers, activeUsers, pendingApprovals });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile by ID
router.put('/users/:id', async (req, res) => {
  try {
    const updates = (({
      name,
      email,
      phone,
      location,
      about,
      preferredSport,
      level,
      achievements,
      goals,
      profileImage,
      age,
      gender,
      philosophy,
    }) => ({
      name,
      email,
      phone,
      location,
      about,
      preferredSport,
      level,
      achievements,
      goals,
      profileImage,
      age,
      gender,
      philosophy,
    }))(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      select: '-password',
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create user (admin panel)
router.post('/users/admin-create', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      status,
      sports,
      sessionType,
      location,
      preferredSport,
      level,
      storeName,
      vendorType,
      website,
    } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashed,
      role,
      status: status || 'active',
      preferredSport,
      level,
    });
    await user.save();
    // Role-specific logic
    if (role === 'coach') {
      await Coach.create({
        userId: user._id,
        name,
        sports,
        sessionType,
        location,
      });
    } else if (role === 'athlete') {
      // already set preferredSport, level
    } else if (role === 'vendor') {
      await VendorProfile.create({
        userId: user._id,
        storeName,
        vendorType,
        website,
      });
    }
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Email verification endpoint
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ verificationToken: token });
    if (user) {
      user.isEmailVerified = true;
      user.verificationToken = undefined;
      // Only activate non-coach users on email verification
      if (user.role !== 'coach') {
        user.status = 'active'; // Activate account on email verification
      }
      await user.save();
      return res.json({
        message: 'Email verified successfully. You can now log in.',
      });
    } else {
      // Check if token is invalid but user is already verified
      const alreadyVerifiedUser = await User.findOne({
        isEmailVerified: true,
        verificationToken: { $in: [null, undefined] },
      });
      if (alreadyVerifiedUser) {
        return res.json({
          message: 'Your email is already verified. You can log in.',
        });
      }
      return res
        .status(400)
        .json({ message: 'Invalid or expired verification token.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists
      return res.json({
        message:
          'If your account exists and is not verified, a verification email has been sent.',
      });
    }
    if (user.isEmailVerified) {
      return res.json({
        message: 'Your email is already verified. You can log in.',
      });
    }
    // Generate new verification token
    const crypto = await import('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();
    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    const verifyUrl = `${FRONTEND_URL}/verify-email/${verificationToken}`;
    const mailOptions = {
      to: user.email,
      from: process.env.GMAIL_USER,
      subject: 'Verify your email for Sports Sphere',
      html: `<p>Please <a href="${verifyUrl}">click here</a> to verify your email and activate your account.</p>`,
    };
    await transporter.sendMail(mailOptions);
    res.json({
      message:
        'If your account exists and is not verified, a verification email has been sent.',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
