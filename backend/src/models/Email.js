// src/models/Email.js
import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String, default: '' },
  body: { type: String, default: '' },
  read: { type: Boolean, default: false },
  folder: { type: String, enum: ['inbox','sent','trash'], default: 'inbox' }
}, { timestamps: true });

export default mongoose.model('Email', EmailSchema);
