import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  notificationSent: { type: Boolean, default: false },
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
