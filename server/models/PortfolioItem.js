
import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  type: { type: String, enum: ['video', 'image'], default: 'image' },
  videoUrl: { type: String }
}, { timestamps: true });

portfolioItemSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

const PortfolioItem = mongoose.models.PortfolioItem || mongoose.model('PortfolioItem', portfolioItemSchema);
export default PortfolioItem;
