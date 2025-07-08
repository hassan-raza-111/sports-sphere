import express from 'express';
import VendorProfile from '../models/VendorProfile.js';

const router = express.Router();

// Create a new vendor profile
router.post('/', async (req, res) => {
  const { userId, storeName, vendorType, website } = req.body;
  if (!userId || !storeName || !vendorType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const vendorProfile = new VendorProfile({
      userId,
      storeName,
      vendorType,
      website,
    });
    await vendorProfile.save();
    res.status(201).json({ message: 'Vendor profile created', vendorProfile });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
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

export default router;
