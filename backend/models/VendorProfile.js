import mongoose from 'mongoose';

const vendorProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storeName: { type: String, required: true },
    vendorType: { type: String, required: true },
    website: String,
}, { timestamps: true });

const VendorProfile = mongoose.model('VendorProfile', vendorProfileSchema);
export default VendorProfile; 