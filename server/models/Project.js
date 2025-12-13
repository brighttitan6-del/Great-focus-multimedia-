
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  client: { type: String, required: true },
  clientId: { type: String },
  clientEmail: { type: String, required: true },
  category: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  title: { type: String, required: true },
  dueDate: { type: String },
  progress: { type: Number, default: 0 },
  status: { type: String, enum: ['Planning', 'In Progress', 'Editing', 'Client Review', 'Completed'], default: 'Planning' },
  activities: [{
    id: String,
    text: String,
    date: String,
    type: { type: String, enum: ['info', 'warning', 'success'], default: 'info' }
  }],
  deliverables: [{
    name: String,
    url: String,
    type: { type: String, enum: ['video', 'image', 'file'], default: 'file' }
  }]
}, { timestamps: true });

projectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
