const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  priceStart: { type: String, required: true },
  imageUrl: { type: String },
  iconName: { type: String, default: 'video' },
  packages: [{
    name: String,
    price: String,
    time: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);