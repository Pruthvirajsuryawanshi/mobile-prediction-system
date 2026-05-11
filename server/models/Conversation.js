import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mobile' }],
});

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sessionId: { type: String, required: true },
  title: { type: String, default: 'New Chat' },
  messages: [messageSchema],
  context: {
    budget: Number,
    preferredBrands: [String],
    priorities: [String],     // ['gaming', 'camera', 'battery', 'performance']
    lastRecommendedPhones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mobile' }],
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);
