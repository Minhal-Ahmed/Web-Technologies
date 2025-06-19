const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  type: String,
  image: String
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
