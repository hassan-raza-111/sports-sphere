import express from 'express';
import VendorProfile from '../models/VendorProfile.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js';

const router = express.Router();

// Multer setup for vendor profile image upload
const vendorImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join('uploads', 'vendor-profile');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const uploadVendorImage = multer({ storage: vendorImageStorage });

// Create a new vendor profile
router.post('/', async (req, res) => {
  const {
    userId,
    storeName,
    vendorType,
    website,
    description,
    image,
    instagram,
    facebook,
  } = req.body;
  if (!userId || !storeName || !vendorType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const vendorProfile = new VendorProfile({
      userId,
      storeName,
      vendorType,
      website,
      description,
      image,
      instagram,
      facebook,
    });
    await vendorProfile.save();
    res.status(201).json({ message: 'Vendor profile created', vendorProfile });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload vendor profile image
router.post('/upload-image', uploadVendorImage.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ imagePath: `/${req.file.path.replace(/\\/g, '/')}` });
});

// Get all vendor profiles (for dashboard)
router.get('/', async (req, res) => {
  try {
    const vendors = await VendorProfile.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single vendor profile by userId
router.get('/:userId', async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({
      userId: req.params.userId,
    }).populate('userId', 'name email phone');
    if (!vendor)
      return res.status(404).json({ message: 'Vendor profile not found' });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a vendor profile by userId
router.put('/:userId', async (req, res) => {
  try {
    const updated = await VendorProfile.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: 'Vendor profile not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update vendor's user info (name, email, phone)
router.patch('/user/:userId', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { name, email, phone },
      { new: true, select: '-password' }
    );
    if (!updatedUser)
      return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
