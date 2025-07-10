import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get user's cart
router.get('/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId }).populate({
      path: 'items.productId',
      select: 'name price image stock vendorId',
      populate: {
        path: 'vendorId',
        select: 'name storeName',
      },
    });

    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [] });
      await cart.save();
    }

    // Transform cart items to include vendor name
    const cartItems = cart.items.map((item) => ({
      _id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      stock: item.productId.stock,
      quantity: item.quantity,
      vendorName:
        item.productId.vendorId?.storeName ||
        item.productId.vendorId?.name ||
        'Vendor',
    }));

    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to cart
router.post('/:userId/add', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item quantity
router.put('/:userId/update', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res
        .status(400)
        .json({ message: 'Product ID and quantity are required' });
    }

    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/:userId/remove/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    await cart.save();
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/:userId/clear', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
