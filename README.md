# E-Commerce Web Application

This repository contains a comprehensive E-Commerce web application built with modern web technologies. The project demonstrates full-stack development skills including frontend design, backend API development, database integration, and user authentication.

## Features

- **User Authentication**: Login/Register system with session management
- **Product Catalog**: Browse and view products with detailed information
- **Shopping Cart**: Add/remove items with persistent cart functionality
- **Order Management**: Place orders and view order history
- **Admin Panel**: Administrative dashboard for product and order management
- **Responsive Design**: Multiple UI implementations (Simple, Bootstrap)
- **Database Integration**: MongoDB with Mongoose ODM

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Express-session** - Session management
- **EJS** - Template engine

### Frontend
- **HTML5** - Markup language
- **CSS3** - Styling and layout
- **JavaScript** - Client-side functionality
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icon library

## Project Structure

```
E-Commerce App/
├── App/                    # Main Node.js application
│   ├── models/            # Database models
│   │   ├── User.js        # User schema
│   │   ├── Product.js     # Product schema
│   │   └── Order.js       # Order schema
│   ├── routes/            # API routes
│   ├── views/             # EJS templates
│   ├── public/            # Static assets
│   ├── middleware/        # Custom middleware
│   └── app.js             # Main application file
├── Simple/                # Static HTML implementation
│   ├── index.html         # Homepage
│   ├── product.html       # Product page
│   ├── styles.css         # Styling
│   └── assets/            # Images and media
├── Bootstrap/             # Bootstrap implementation
│   ├── checkout.html      # Checkout form
│   ├── script.js          # Form validation
│   └── style.css          # Custom styles
└── README.md
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "E-Commerce App"
   ```

2. **Install dependencies**
   ```bash
   cd App
   npm install
   ```

3. **Database Setup**
   - Ensure MongoDB is installed and running
   - Update the MongoDB connection string in `app.js`

4. **Run the application**
   ```bash
   npm start
   # or
   node app.js
   ```

5. **Access the application**
   - Open browser and navigate to `http://localhost:3000`

## Usage

### For Regular Users
1. Register a new account or login with existing credentials
2. Browse products on the homepage
3. Add items to cart
4. Proceed to checkout and place orders
5. View order history in "My Orders" section

### For Administrators
1. Login with admin credentials
2. Access admin dashboard at `/admin/dashboard`
3. Manage products and orders
4. View analytics and reports

## API Endpoints

- `GET /` - Homepage (requires login)
- `POST /login` - User authentication
- `POST /register` - User registration
- `GET /logout` - User logout
- `GET /my-orders` - User order history
- `GET /admin/dashboard` - Admin panel
- `/api/cart` - Cart management routes
- `/api/checkout` - Checkout process routes

## Database Models

### User Model
- Email (unique)
- Password
- isAdmin (boolean)

### Product Model
- Product ID
- Product Name
- Price
- Image URL
- Colors
- Label
- Size

### Order Model
- User Email
- Order Items
- Total Amount
- Order Date
- Status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for educational purposes as part of the Web Technologies course.

