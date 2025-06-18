let express = require("express");
let router = express.Router();
let ProductModel = require("../../models/product.model");
router.put("/api/products/:id", async (req, res) => {
  let record = await ProductModel.findById(req.params.id);
  record.title = req.body.title;
  record.description = req.body.description;
  record.price = req.body.price;
  await record.save();
  return res.send(record);
});
router.get("/api/products/:id", async (req, res) => {
  let record = await ProductModel.findById(req.params.id);
  return res.send(record);
});

router.delete("/api/products/:id", async (req, res) => {
  let record = await ProductModel.findByIdAndDelete(req.params.id);
  return res.send(record);
});

router.post("/api/products", async (req, res) => {
  let data = req.body;
  let record = new ProductModel(data);
  await record.save();
  return res.send(record);
});

router.get("/api/products", async (req, res) => {
  let records = await ProductModel.find();
  return res.send(records);
});
module.exports = router;