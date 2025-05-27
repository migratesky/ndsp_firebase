import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, required: true, enum: ['article', 'video', 'document'] },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Check if model already exists before creating it
const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);

export { Content };
