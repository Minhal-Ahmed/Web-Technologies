const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');

// Middleware to ensure user is logged in
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

// GET /checkout - Display checkout page
router.get('/checkout', requireLogin, (req, res) => {
  const cartItems = req.session.cart || [];
  
  if (cartItems.length === 0) {
    return res.redirect('/cart');
  }
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15.00; // Fixed shipping cost
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  
  res.render('checkout', {
    cartItems,
    subtotal,
    shipping,
    tax,
    total,
    title: 'Checkout',
    user: req.session.user
  });
});

// POST /place-order - Handle order placement
router.post('/place-order', requireLogin, async (req, res) => {
  try {
    const { customerInfo } = req.body;
    const cartItems = req.session.cart || [];
    
    if (cartItems.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Cart is empty' 
      });
    }
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    for (let field of requiredFields) {
      if (!customerInfo[field] || customerInfo[field].trim() === '') {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 15.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    // Create order object matching your schema
    const orderData = {
      customerInfo: {
        firstName: customerInfo.firstName.trim(),
        lastName: customerInfo.lastName.trim(),
        email: customerInfo.email.trim().toLowerCase(),
        phone: customerInfo.phone.trim(),
        address: customerInfo.address.trim(),
        city: customerInfo.city.trim()
      },
      items: cartItems.map(item => ({
        productId: item.productId,
        title: item.productName || item.title,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      })),
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: 'cash_on_delivery',
      status: 'pending',
      orderDate: new Date()
    };
    
    // Save order to database
    const order = new Order(orderData);
    await order.save();
    
    console.log('✅ Order placed successfully:', order._id);
    
    // Clear the cart
    req.session.cart = [];
    
    // Send success response
    res.json({ 
      success: true, 
      orderId: order._id,
      message: 'Order placed successfully!' 
    });
    
  } catch (error) {
    console.error('❌ Error placing order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to place order. Please try again.' 
    });
  }
});

// GET /order-confirmation/:orderId - Order confirmation page
router.get('/order-confirmation/:orderId', requireLogin, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).render('error', { 
        message: 'Order not found',
        title: 'Order Not Found',
        user: req.session.user
      });
    }
    
    res.render('order-confirmation', { 
      order,
      title: 'Order Confirmation',
      user: req.session.user
    });
    
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).render('error', { 
      message: 'Error loading order details',
      title: 'Error',
      user: req.session.user
    });
  }
});

// GET /my-orders - View user's orders (bonus feature)
router.get('/my-orders', requireLogin, async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    const orders = await Order.find({ 'customerInfo.email': userEmail })
                             .sort({ orderDate: -1 });
    
    res.render('my-orders', {
      title: 'My Orders',
      orders,
      user: req.session.user
    });
    
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.render('my-orders', {
      title: 'My Orders',
      orders: [],
      error: 'Failed to load orders',
      user: req.session.user
    });
  }
});

module.exports = router;