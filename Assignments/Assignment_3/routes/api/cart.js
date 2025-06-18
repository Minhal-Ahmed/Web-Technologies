const express = require("express");
const router = express.Router();

router.post("/add-to-cart", (req, res) => {
  const { productId, productName, price, image } = req.body; // Add image here
  
  if (!req.session.cart) req.session.cart = [];
  
  const existing = req.session.cart.find(item => item.productId === productId);
  
  if (existing) {
    existing.quantity += 1;
  } else {
    req.session.cart.push({
      productId,
      productName,
      price: parseFloat(price),
      image, // Store the image path
      quantity: 1
    });
  }
  
  res.redirect("/product");
});

router.get("/cart", (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render("cart", { cart, total, title: "Your Cart" });
});

router.post("/remove-from-cart", (req, res) => {
  const { productId } = req.body;
  req.session.cart = req.session.cart?.filter(item => item.productId !== productId) || [];
  res.redirect("/cart");
});

router.post("/update-quantity", (req, res) => {
  const { productId, quantity } = req.body;
  const qty = parseInt(quantity);
  const item = req.session.cart?.find(i => i.productId === productId);
  if (item) item.quantity = qty > 0 ? qty : 1;
  res.redirect("/cart");
});

module.exports = router;
