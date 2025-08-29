const express = require('express');
const router = express.Router();

// Middleware to ensure user is logged in
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

// Display cart page
router.get('/cart', requireLogin, (req, res) => {
  const cart = req.session.cart || [];
  
  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.render('cart', {
    title: 'Shopping Cart',
    cart,
    total,
    user: req.session.user
  });
});

// Add item to cart
router.post('/add-to-cart', requireLogin, (req, res) => {
  const { productId, title, price, image, quantity = 1 } = req.body;
  
  // Initialize cart if it doesn't exist
  if (!req.session.cart) {
    req.session.cart = [];
  }
  
  // Check if item already exists in cart
  const existingItemIndex = req.session.cart.findIndex(item => item.productId === productId);
  
  if (existingItemIndex > -1) {
    // Item exists, update quantity
    req.session.cart[existingItemIndex].quantity += parseInt(quantity);
  } else {
    // New item, add to cart
    req.session.cart.push({
      productId,
      productName: title,
      price: parseFloat(price),
      image,
      quantity: parseInt(quantity)
    });
  }
  
  console.log('✅ Cart updated:', req.session.cart);
  res.json({ success: true, message: 'Item added to cart!' });
});

// Update quantity of item in cart
router.post('/update-quantity', requireLogin, (req, res) => {
  const { productId, quantity } = req.body;
  const newQuantity = parseInt(quantity);
  
  if (!req.session.cart || newQuantity < 1) {
    return res.redirect('/cart');
  }
  
  // Find the item and update quantity
  const itemIndex = req.session.cart.findIndex(item => item.productId === productId);
  
  if (itemIndex > -1) {
    req.session.cart[itemIndex].quantity = newQuantity;
    console.log('✅ Quantity updated for product:', productId, 'New quantity:', newQuantity);
  }
  
  res.redirect('/cart');
});

// Remove item from cart
router.post('/remove-from-cart', requireLogin, (req, res) => {
  const { productId } = req.body;
  
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  
  // Remove item from cart
  req.session.cart = req.session.cart.filter(item => item.productId !== productId);
  console.log('✅ Item removed from cart:', productId);
  
  res.redirect('/cart');
});

// Clear entire cart
router.post('/clear-cart', requireLogin, (req, res) => {
  req.session.cart = [];
  console.log('✅ Cart cleared');
  res.redirect('/cart');
});

// Get cart count (for header badge)
router.get('/cart-count', requireLogin, (req, res) => {
  const cart = req.session.cart || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  res.json({ count: totalItems });
});

// View cart as JSON (for debugging)
router.get('/view-cart', requireLogin, (req, res) => {
  res.json(req.session.cart || []);
});

module.exports = router;