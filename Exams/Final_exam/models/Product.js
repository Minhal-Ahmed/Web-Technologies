const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  price: Number,
  image: String,
  colors: String,
  label: String,
  size: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;




