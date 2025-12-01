const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  priceStart: { type: String, required: true },
  imageUrl: { type: String },
  videoUrl: { type: String },
  iconName: { type: String, default: 'video' },
  isActive: { type: Boolean, default: true },
  packages: [{
    name: String,
    price: String,
    time: String
  }]
}, { timestamps: true });

serviceSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.models.Service || mongoose.model('Service', serviceSchema);