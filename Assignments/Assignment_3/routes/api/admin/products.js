const express = require('express');
const router = express.Router();
const Product = require('../../../models/Product');
const productRoutes = require("./products");

// Middleware to restrict access to admins only
function requireAdmin(req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send("Admins only");
  }
  next();
}

// GET /admin/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("admin/product", {
    layout:"auth-layout",
      title: "Manage Products",
      products,
    });
  } catch (err) {
    console.error("❌ Product fetch error:", err);
    res.status(500).send("Server error fetching products");
  }
});

// Show Add Product Form
// routes/api/admin/products.js
router.get("/add", (req, res) => {
  res.render("admin/add-product", {
    layout: "auth-layout",
    title: "Add Product"
  });
});

// Handle Add Product POST
router.post("/add", async (req, res) => {
  try {
    const { productId, productName, price, image, colors, label, size } = req.body;
    const newProduct = new Product({ productId, productName, price, image, colors, label, size });
    await newProduct.save();
    res.redirect("/admin/products");
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).send("Failed to add product.");
  }
});



// Edit product form
router.get("/edit/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");

    res.render("admin/edit-product", {
      title: "Edit Product",
      layout: false,
      product
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching product");
  }
});




// POST /admin/products/edit/:id
router.post("/edit/:id", requireAdmin, async (req, res) => {
  const { productId, productName, price, image, colors, label, size } = req.body;

  try {
    await Product.findByIdAndUpdate(req.params.id, {
      productId,
      productName,
      price,
      image,
      colors,
      label,
      size,
    });

    res.redirect("/admin/products");
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).send("Failed to update product.");
  }
});

//router.use("/", productRoutes);

module.exports = router;




