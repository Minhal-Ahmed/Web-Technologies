const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const Order = require("./models/Order"); // add this next to User require
const cartRoutes = require('./routes/api/cart');

// MongoDB Connection
let dbConnectionString =
  "mongodb+srv://Minhal:.cu3wrZQS!WkA5h@cluster0.fi1xbhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(dbConnectionString)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB error:", err));

// Middleware
app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for forms

app.use(
  session({
    secret: "superSecretSessionKey123", // change this in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000, // ⏰ 30 minutes in milliseconds
    },
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.set("view engine", "ejs");
app.set("layout", "layout"); // uses views/layout.ejs

// Routes
app.get("/", requireLogin, (req, res) => {
  res.render("index", { title: "Home", user: req.session.user});
});



// Register POST route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Simple version (for now) — NO HASHING YET
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.send("User already exists!");

    const newUser = new User({ email, password });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    res.status(500).send("Registration failed. Try again.");
  }
});

// Login POST route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ email: username });
    if (!user || user.password !== password) {
      return res.send("Invalid credentials");
    }
    req.session.user = user;
  console.log("✅ Session user stored:", req.session.user); 

    res.redirect("/index");
 // pass user if needed
  } catch (err) {
    res.status(500).send("Login failed. Try again.");
  }
});


app.get("/login", (req, res) => {
  res.render("login", { layout: "auth-layout",title: "Login" });
});

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}


/*Home Page */
app.get("/index", requireLogin, (req, res) => {
  res.render("index", {
    title: "Boden",
    user: req.session.user,
  });
});


app.get("/register", (req, res) => {
  res.render("register", {layout: "auth-layout", title: "Register" });
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


//Products route
app.get("/product", (req, res) => {
  res.render("product", { title: "Products",user: req.session.user });
});

app.get("/view-cart", (req, res) => {
  res.json(req.session.cart || []);
});


//Orders route
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




// API routers (if used)
app.use("/", require("./routes/api/products.router"));
app.use('/', require('./routes/api/cart'));


// Start server
app.listen(3000, () => {
  console.log("✅ Server started at http://localhost:3000");
});
