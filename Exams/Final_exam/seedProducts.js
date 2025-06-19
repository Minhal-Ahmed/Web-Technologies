// seedProducts.js

const mongoose = require('mongoose');
const Product = require('./models/Product'); // Adjust path if models folder is elsewhere

const MONGODB_URI =   "mongodb+srv://Minhal:.cu3wrZQS!WkA5h@cluster0.fi1xbhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your DB name

const products = [
  { productId: "p1", productName: "Carla Linen Midi Dress", price: 136.00, image: "assets/product1.webp", colors: "5 Colours", label: "SELLING FAST", size: "regular" },
  { productId: "p2", productName: "Floral Summer Maxi", price: 90.00, image: "assets/product2.webp", colors: "2 Colours", size: "regular" },
  { productId: "p3", productName: "Pleated Sleeveless Dress", price: 90.00, image: "assets/product3.webp", colors: "2 Colours", size: "regular" },
  { productId: "p4", productName: "Isabella Cotton Satin Skirt", price: 90.00, image: "assets/product4.webp", colors: "2 Colours", size: "regular" },
  { productId: "p5", productName: "Crew Neck Dress", price: 136.00, image: "assets/bigproduct1.webp", colors: "5 Colours", label: "SELLING FAST", size: "big" },
  { productId: "p6", productName: "Silk Blend Top", price: 90.00, image: "assets/bigproduct2.webp", colors: "2 Colours", size: "big" },
  { productId: "p7", productName: "Pleat Linen Wide Leg Shorts", price: 90.00, image: "assets/product5.webp", colors: "2 Colours", label: "SELLING FAST", size: "regular" },
  { productId: "p8", productName: "Pleat Linen Wide Leg Shorts", price: 90.00, image: "assets/product6.webp", colors: "2 Colours", size: "regular" },
  { productId: "p9", productName: "Pleat Linen Wide Leg Shorts", price: 90.00, image: "assets/product7.webp", colors: "2 Colours", size: "regular" },
  { productId: "p10", productName: "Pleat Linen Wide Leg Shorts", price: 90.00, image: "assets/product8.webp", colors: "2 Colours", size: "regular" },
  { productId: "p11", productName: "Summer Midi Dress", price: 136.00, image: "assets/bigproduct3.webp", colors: "5 Colours", label: "SELLING FAST", size: "big" },
  { productId: "p12", productName: "Casual Wide Leg Shorts", price: 90.00, image: "assets/bigproduct4.webp", colors: "2 Colours", size: "big" },
  { productId: "p13", productName: "Evening Midi Dress", price: 136.00, image: "assets/product9.webp", colors: "5 Colours", label: "SELLING FAST", size: "regular" },
  { productId: "p14", productName: "Relaxed Linen Shorts", price: 90.00, image: "assets/product10.webp", colors: "2 Colours", size: "regular" },
  { productId: "p15", productName: "Comfort Linen Shorts", price: 90.00, image: "assets/product11.webp", colors: "2 Colours", size: "regular" },
  { productId: "p16", productName: "Breathable Linen Shorts", price: 90.00, image: "assets/product12.webp", colors: "2 Colours", size: "regular" },
  { productId: "p17", productName: "Designer Midi Dress", price: 136.00, image: "assets/bigproduct5.webp", colors: "5 Colours", label: "SELLING FAST", size: "big" },
  { productId: "p18", productName: "Premium Linen Shorts", price: 90.00, image: "assets/bigproduct6.webp", colors: "2 Colours", size: "big" },
  { productId: "p19", productName: "Classic Midi Dress", price: 136.00, image: "assets/product13.webp", colors: "5 Colours", label: "SELLING FAST", size: "regular" },
  { productId: "p20", productName: "Versatile Linen Shorts", price: 90.00, image: "assets/product14.webp", colors: "2 Colours", size: "regular" },
  { productId: "p21", productName: "Trendy Linen Shorts", price: 90.00, image: "assets/product15.webp", colors: "2 Colours", size: "regular" },
  { productId: "p22", productName: "Stylish Linen Shorts", price: 90.00, image: "assets/product16.webp", colors: "2 Colours", size: "regular" }
];

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB Connected');
    await Product.deleteMany(); 
    await Product.insertMany(products);
    console.log('Products seeded successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error seeding products:', err);
  });
