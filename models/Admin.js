// server/models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullname: { type: String, required: true }, 
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super'], default: 'admin' } 
});

module.exports = mongoose.model('Admin', adminSchema);


// hash password before saving
/*adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});*/

