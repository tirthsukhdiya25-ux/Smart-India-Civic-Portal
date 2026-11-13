const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
  department: { type: String, default: '' },
  phone: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
