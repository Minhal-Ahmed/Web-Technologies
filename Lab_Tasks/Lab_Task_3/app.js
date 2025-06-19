const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const User = require("./models/User");
const Order = require("./models/Order");
const app = express();
const checkoutRoutes = require('./routes/api/checkout');
const cartRoutes = require('./routes/api/cart');


// MongoDB Connection
mongoose.connect("mongodb+srv://Minhal:.cu3wrZQS!WkA5h@cluster0.fi1xbhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB error:", err));

// Middleware
app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "superSecretSessionKey123",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 },
}));

// Make session user available in views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.set("view engine", "ejs");
app.set("layout", "layout");

// Auth Middleware
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}
// app.js (before routes)
app.use((req, res, next) => {
  res.locals.cart = req.session.cart || { totalQty: 0 };
  next();
});

// Routes

app.get("/", requireLogin, (req, res) => {
  res.render("index", { title: "Home", user: req.session.user });
});

app.get("/index", requireLogin, (req, res) => {
  res.render("index", { title: "Boden", user: req.session.user });
});

app.get("/login", (req, res) => {
  res.render("login", { layout: "auth-layout", title: "Login" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ email: username });

    if (!user || user.password !== password) {
      return res.send("Invalid credentials");
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    };

    console.log("✅ Logged in:", req.session.user);

    if (user.isAdmin) {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/index");
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Login failed. Try again.");
  }
});

app.get("/register", (req, res) => {
  res.render("register", { layout: "auth-layout", title: "Register" });
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.send("User already exists!");
    const newUser = new User({ email, password });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    res.status(500).send("Registration failed. Try again.");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Logout error:", err);
      return res.redirect("/");
    }
    res.redirect("/login");
  });
});

// Orders route
app.get("/my-orders", requireLogin, async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    const orders = await Order.find({ userEmail });
    res.render("my-orders", {
      title: "My Orders",
      orders,
    });
  } catch (err) {
    res.status(500).send("Failed to fetch orders.");
  }
});



app.use('/', checkoutRoutes); 




// Cart view (JSON test route)
app.get("/view-cart", (req, res) => {
  res.json(req.session.cart || []);
});


// Routers
app.use("/", require("./routes/api/product")); 
app.use("/", require("./routes/api/cart"));
//app.use("/admin", require("./routes/api/admin"));
app.use('/', cartRoutes); // or whatever your route base is
app.use("/admin", require("./routes/api/admin")); // This is needed ✅

// After other route imports
//app.use("/admin", require("./routes/api/admin/index"));

// Start server
app.listen(3000, () => {
  console.log("✅ Server started at http://localhost:3000");
});
