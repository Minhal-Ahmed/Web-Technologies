const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");

// ✅ User-facing product page
router.get("/product", async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("product", {
      title: "Browse Products",
      products,
      user: req.session.user,
      totalProductCount: products.length  // ✅ Add this line

    });
  } catch (err) {
    console.error("❌ Error loading products:", err);
    res.status(500).send("Something went wrong.");
  }
});

module.exports = router;
