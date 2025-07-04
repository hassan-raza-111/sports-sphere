import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    type: { type: String, required: true },
    data: { type: Object, required: true },
    date: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);
export default Report; 