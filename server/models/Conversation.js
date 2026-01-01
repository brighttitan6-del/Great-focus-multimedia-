import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String },
  color: { type: String },
  email: { type: String },
  phone: { type: String },
  project: { type: String },
  status: { type: String, enum: ['online', 'offline', 'busy'], default: 'offline' },
  lastMessage: { type: String },
  time: { type: String },
  unread: { type: Number, default: 0 },
  history: [{
    id: String,
    sender: { type: String, enum: ['admin', 'client'] },
    text: String,
    time: String
  }]
}, { timestamps: true });

conversationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
export default Conversation;