const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // ✅ add this line
    email: { type: String, required: false, unique: true, sparse: true },
    mobile: { type: String, required: false, unique: true, sparse: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
