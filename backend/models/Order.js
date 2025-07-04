import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expiry: { type: String, required: true },
    cvv: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    selectedBank: String,
    amount: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['completed', 'pending', 'failed', 'refunded'], default: 'pending' },
    transactionId: { type: String },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order; 