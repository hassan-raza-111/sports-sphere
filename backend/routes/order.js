import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { Parser as CsvParser } from 'json2csv';
import PDFDocument from 'pdfkit';

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
    const { userId, products, totalAmount, paymentMethod, shippingInfo } =
      req.body;
    if (
      !userId ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0 ||
      !totalAmount ||
      !paymentMethod ||
      !shippingInfo
    ) {
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
    const vendorOrders = orders.filter((order) =>
      order.products.some(
        (p) =>
          p.productId &&
          p.productId.vendorId &&
          p.productId.vendorId.toString() === vendorId
      )
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
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )
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

// Vendor Earnings Overview
router.get('/vendor/:vendorId/earnings', async (req, res) => {
  try {
    const { vendorId } = req.params;
    // Get all orders for this vendor
    const orders = await Order.find({ 'products.productId': { $exists: true } })
      .populate('products.productId', 'vendorId price')
      .populate('userId', 'name email');
    // Filter orders for this vendor
    const vendorOrders = orders.filter((order) =>
      order.products.some(
        (p) =>
          p.productId &&
          p.productId.vendorId &&
          p.productId.vendorId.toString() === vendorId
      )
    );
    // Calculate stats
    let totalSales = 0,
      pending = 0,
      approved = 0,
      rejected = 0;
    vendorOrders.forEach((order) => {
      if (order.status === 'completed') {
        totalSales += order.totalAmount || 0;
        approved += order.totalAmount || 0;
      } else if (
        order.status === 'pending' ||
        order.status === 'process' ||
        order.status === 'shipped'
      ) {
        pending += order.totalAmount || 0;
      } else if (order.status === 'cancelled') {
        rejected += order.totalAmount || 0;
      }
    });
    res.json({ totalSales, pending, approved, rejected });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch earnings' });
  }
});

// Vendor CSV Report Download
router.get('/vendor/:vendorId/report.csv', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const orders = await Order.find({ 'products.productId': { $exists: true } })
      .populate('products.productId', 'vendorId name price')
      .populate('userId', 'name email');
    const vendorOrders = orders.filter((order) =>
      order.products.some(
        (p) =>
          p.productId &&
          p.productId.vendorId &&
          p.productId.vendorId.toString() === vendorId
      )
    );
    const rows = vendorOrders.map((order) => ({
      orderId: order._id,
      date: order.createdAt,
      buyer: order.userId?.name || '',
      amount: order.totalAmount,
      products: order.products
        .map((p) => p.productId?.name + ' x' + p.quantity)
        .join('; '),
      status: order.status,
    }));
    const parser = new CsvParser({
      fields: ['orderId', 'date', 'buyer', 'amount', 'products', 'status'],
    });
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment('vendor_report.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Failed to download CSV' });
  }
});

// Vendor PDF Report Download (placeholder)
router.get('/vendor/:vendorId/report.pdf', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const orders = await Order.find({ 'products.productId': { $exists: true } })
      .populate('products.productId', 'vendorId name price')
      .populate('userId', 'name email');
    const vendorOrders = orders.filter((order) =>
      order.products.some(
        (p) =>
          p.productId &&
          p.productId.vendorId &&
          p.productId.vendorId.toString() === vendorId
      )
    );
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=vendor_report.pdf'
    );
    doc.text('Vendor Sales Report', { align: 'center', underline: true });
    doc.moveDown();
    vendorOrders.forEach((order) => {
      doc.text(`Order ID: ${order._id}`);
      doc.text(`Date: ${order.createdAt}`);
      doc.text(`Buyer: ${order.userId?.name || ''}`);
      doc.text(`Amount: PKR ${order.totalAmount}`);
      doc.text(
        `Products: ${order.products
          .map((p) => p.productId?.name + ' x' + p.quantity)
          .join('; ')}`
      );
      doc.text(`Status: ${order.status}`);
      doc.moveDown();
    });
    doc.end();
    doc.pipe(res);
  } catch (err) {
    res.status(500).json({ message: 'Failed to download PDF' });
  }
});

// GET /api/orders?userId=...
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    const orders = await Order.find({ userId })
      .populate('products.productId', 'name price image')
      .sort({ paymentDate: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Vendor Analytics (sales, orders, charts)
router.get('/vendor/:vendorId/analytics', async (req, res) => {
  try {
    const { vendorId } = req.params;
    // Get all orders for this vendor
    const orders = await Order.find({ 'products.productId': { $exists: true } })
      .populate('products.productId', 'vendorId name price')
      .populate('userId', 'name email');
    // Filter orders for this vendor
    const vendorOrders = orders.filter((order) =>
      order.products.some(
        (p) =>
          p.productId &&
          p.productId.vendorId &&
          p.productId.vendorId.toString() === vendorId
      )
    );
    // Total sales and orders
    let totalSales = 0;
    let totalOrders = vendorOrders.length;
    let salesByMonth = {};
    let productSales = {};
    vendorOrders.forEach((order) => {
      // Only count this vendor's products in each order
      order.products.forEach((p) => {
        if (
          p.productId &&
          p.productId.vendorId &&
          p.productId.vendorId.toString() === vendorId
        ) {
          // Total sales
          totalSales += (p.productId.price || 0) * (p.quantity || 1);
          // Sales by month
          const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
          salesByMonth[month] =
            (salesByMonth[month] || 0) +
            (p.productId.price || 0) * (p.quantity || 1);
          // Product sales
          const prodName = p.productId.name || 'Unknown';
          productSales[prodName] =
            (productSales[prodName] || 0) + (p.quantity || 1);
        }
      });
    });
    res.json({ totalSales, totalOrders, salesByMonth, productSales });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vendor analytics' });
  }
});

export default router;
