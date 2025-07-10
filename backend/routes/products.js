import express from 'express';
import Product from '../models/Product.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Multer setup for product image upload
const productImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join('uploads', 'products');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const uploadProductImage = multer({ storage: productImageStorage });

// Upload product image
router.post('/upload-image', uploadProductImage.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ imagePath: `/${req.file.path.replace(/\\/g, '/')}` });
});

// Get all products for a vendor
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.params.vendorId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit a product
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image, category, stock },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products with vendor information
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate(
      'vendorId',
      'name storeName'
    );
    const productsWithVendor = products.map((product) => ({
      ...product.toObject(),
      vendorName:
        product.vendorId?.storeName || product.vendorId?.name || 'Vendor',
    }));
    res.json(productsWithVendor);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a product
router.post('/', async (req, res) => {
  const { name, description, price, image, vendorId, category, stock } =
    req.body;
  if (
    !name ||
    !description ||
    !price ||
    !image ||
    !vendorId ||
    !category ||
    stock === undefined
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const product = new Product({
      name,
      description,
      price,
      image,
      vendorId,
      category,
      stock,
    });
    await product.save();
    res.status(201).json({ message: 'Product added', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
