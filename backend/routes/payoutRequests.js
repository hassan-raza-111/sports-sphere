import express from 'express';
import PayoutRequest from '../models/PayoutRequest.js';

const router = express.Router();

// Vendor: Submit payout request
router.post('/vendor/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { amount, paymentDetails, notes } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ message: 'Invalid amount' });
    const payout = new PayoutRequest({
      vendorId,
      amount,
      paymentDetails,
      notes,
    });
    await payout.save();
    res.status(201).json({ message: 'Payout request submitted', payout });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit payout request' });
  }
});

// Vendor: Get payout history
router.get('/vendor/:vendorId/history', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const history = await PayoutRequest.find({ vendorId }).sort({
      requestedAt: -1,
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payout history' });
  }
});

// Admin: List all payout requests
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    const skip = (page - 1) * limit;
    const payoutRequests = await PayoutRequest.find(query)
      .populate('vendorId', 'name email')
      .sort({ requestedAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    const total = await PayoutRequest.countDocuments(query);
    res.json({
      payoutRequests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching payout requests:', error);
    res.status(500).json({ message: 'Failed to fetch payout requests' });
  }
});

// Admin: Approve/Reject payout request
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const update = { status };
    if (status === 'approved') update.processedAt = new Date();
    if (notes !== undefined) update.notes = notes;
    const payout = await PayoutRequest.findByIdAndUpdate(id, update, {
      new: true,
    }).populate('vendorId', 'name email');
    if (!payout)
      return res.status(404).json({ message: 'Payout request not found' });
    res.json({ message: `Payout request ${status}`, payout });
  } catch (error) {
    console.error('Error updating payout request:', error);
    res.status(500).json({ message: 'Failed to update payout request' });
  }
});

export default router;
