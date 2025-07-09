const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  sNo: { type: Number, unique: true },
  username: { type: String, required: true },
  type: { type: String, enum: ['vendor', 'customer'], required: true },
  phoneNo: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);