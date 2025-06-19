const express = require("express");
const router = express.Router();
const User = require("../../../models/User");
const Order = require("../../../models/Order");
const productRoutes = require("./products");

// Admin auth middleware
function requireAdmin(req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send("Admins only");
  }
  next();
}


// GET /admin/orders
router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user") // If your Order model references users
      .sort({ createdAt: -1 });

    res.render("admin/orders", {
      layout: "auth-layout", // Or false if you're not using layouts
      title: "All Orders",
      orders,
    });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).send("Failed to load orders.");
  }
});


// Admin dashboard
router.get("/dashboard", requireAdmin, async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const orders = await Order.find({});
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  res.render("admin/dashboard", {
    layout: false,
    totalUsers,
    totalOrders,
    totalRevenue,
    admin: req.session.user,
  });
});


//router.use("/products", productRoutes); // <-- this mounts /admin/products
// Mounts /admin/products/...
router.use('/products', productRoutes);

module.exports = router;
