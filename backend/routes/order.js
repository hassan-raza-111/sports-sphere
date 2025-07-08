import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// Get all orders (for admin)
router.get('/admin', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      search,
      startDate,
      endDate,
    } = req.query;

    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by payment status
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Search by transaction ID or user name
    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('products.productId', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get payment statistics (for admin)
router.get('/admin/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.$lte = new Date(endDate);
      }
    }

    // Total revenue
    const totalRevenue = await Order.aggregate([
      { $match: { ...dateFilter, paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Pending payments
    const pendingPayments = await Order.aggregate([
      { $match: { ...dateFilter, paymentStatus: 'pending' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Refunded amount
    const refundedAmount = await Order.aggregate([
      { $match: { ...dateFilter, paymentStatus: 'refunded' } },
      { $group: { _id: null, total: { $sum: '$refundAmount' } } },
    ]);

    // Total transactions
    const totalTransactions = await Order.countDocuments(dateFilter);

    // Payment status breakdown
    const statusBreakdown = await Order.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingPayments: pendingPayments[0]?.total || 0,
      refundedAmount: refundedAmount[0]?.total || 0,
      totalTransactions,
      statusBreakdown: statusBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({ message: 'Failed to fetch payment statistics' });
  }
});

// Update order status (for admin)
router.put('/admin/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus, adminNotes, refundAmount, refundReason } =
      req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (refundAmount !== undefined) updateData.refundAmount = refundAmount;
    if (refundReason) updateData.refundReason = refundReason;

    // If refunding, set refund date
    if (paymentStatus === 'refunded') {
      updateData.refundDate = new Date();
    }

    // If processing payment, set processed info
    if (paymentStatus === 'completed') {
      updateData.paymentDate = new Date();
      updateData.processedBy = req.user?._id;
      updateData.processedAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    }).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

// Get order details (for admin)
router.get('/admin/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('userId', 'name email phone')
      .populate('products.productId', 'name price image')
      .populate('processedBy', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
});

// Export orders (for admin)
router.get('/admin/export', async (req, res) => {
  try {
    const { status, paymentStatus, startDate, endDate } = req.query;

    let query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('products.productId', 'name')
      .sort({ createdAt: -1 });

    // Convert to CSV format
    const csvData = orders.map((order) => ({
      'Transaction ID': order.transactionId,
      'Customer Name': order.userId?.name || 'N/A',
      'Customer Email': order.userId?.email || 'N/A',
      Amount: `$${order.totalAmount}`,
      'Payment Method': order.paymentMethod,
      'Payment Status': order.paymentStatus,
      'Order Status': order.status,
      Date: order.createdAt.toLocaleDateString(),
      'Admin Notes': order.adminNotes || '',
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=orders-export.csv'
    );

    // Convert to CSV string
    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`)
          .join(',')
      ),
    ].join('\n');

    res.send(csvString);
  } catch (error) {
    console.error('Error exporting orders:', error);
    res.status(500).json({ message: 'Failed to export orders' });
  }
});

// Create a new order (checkout)
router.post('/', async (req, res) => {
  try {
    const { userId, products, totalAmount, paymentMethod, shippingInfo } = req.body;
    if (!userId || !products || !Array.isArray(products) || products.length === 0 || !totalAmount || !paymentMethod || !shippingInfo) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const order = new Order({
      userId,
      products,
      totalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      status: 'pending',
      shippingInfo,
    });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId })
      .populate('products.productId', 'name price image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
});

// Get all orders for a vendor
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    // Find orders where any product's vendor matches vendorId
    const orders = await Order.find({
      'products.productId': { $exists: true },
    })
      .populate('userId', 'name email')
      .populate('products.productId', 'name price vendorId')
      .sort({ createdAt: -1 });
    // Filter orders to only those containing products for this vendor
    const vendorOrders = orders.filter(order =>
      order.products.some(p => p.productId && p.productId.vendorId && p.productId.vendorId.toString() === vendorId)
    );
    res.json(vendorOrders);
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    res.status(500).json({ message: 'Failed to fetch vendor orders' });
  }
});

// Vendor updates order status
router.put('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
      .populate('userId', 'name email')
      .populate('products.productId', 'name price');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// Get order details
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('userId', 'name email phone')
      .populate('products.productId', 'name price image vendorId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
});

export default router;
