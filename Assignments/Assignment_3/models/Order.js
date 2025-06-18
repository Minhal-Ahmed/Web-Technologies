// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userEmail: String,
  items: [String], // Or use an array of product objects
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
