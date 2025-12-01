const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  avatar: { type: String },
}, { timestamps: true });

// Check if model exists before defining to prevent OverwriteModelError in serverless env
module.exports = mongoose.models.User || mongoose.model('User', userSchema);