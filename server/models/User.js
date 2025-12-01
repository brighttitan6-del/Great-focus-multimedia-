import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  avatar: { type: String },
}, { timestamps: true });

// Check if model exists before defining to prevent OverwriteModelError in serverless env
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;