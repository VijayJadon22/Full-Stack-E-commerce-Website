# E-Commerce Platform

A comprehensive full-stack e-commerce application with a robust backend API built with Node.js, Express, and MongoDB, featuring user authentication, product management, shopping cart functionality, order processing, and secure payment processing.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Backend API](#backend-api)
  - [Models](#models)
  - [Authentication & Authorization](#authentication--authorization)
  - [Payment Integration](#payment-integration)
  - [Caching Strategy](#caching-strategy)
  - [Cloud Integration](#cloud-integration)
  - [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Security Features](#security-features)
- [Future Enhancements](#future-enhancements)

## Overview

This project is a feature-rich e-commerce platform designed for performance, security, and scalability. It implements modern web development concepts like JWT-based authentication, Redis caching, Cloudinary for image storage, and integrates Razorpay for secure payment processing.

## Features

### User Management
- Signup, login, profile management with JWT authentication
- Role-based access control (admin/customer)

### Product Management
- CRUD operations for products
- Product categorization
- Featured product highlighting
- Product recommendations

### Shopping Cart
- Add products to cart
- Update product quantities
- Remove products from cart
- View cart contents

### Order Processing
- Create orders
- Process payments through Razorpay
- Order history

### Coupon System
- Create and validate coupon codes
- Apply discounts
- Automatic coupon generation for large orders

### Analytics
- Total sales tracking
- Revenue analysis
- User statistics
- Daily sales data

### Cloud Features
- Cloudinary integration for image storage
- Redis caching for performance optimization

## System Architecture

The system is built using a Model-View-Controller (MVC) architecture:

- **Models**: MongoDB schemas using Mongoose
- **Controllers**: Business logic for handling requests and responses
- **Routes**: API endpoint definitions
- **Middleware**: Authentication, authorization, and request validation
- **Libraries**: Custom modules for payment processing, caching, cloud storage

### External Services

- MongoDB (Database)
- Redis (Caching)
- Cloudinary (Image storage)
- Razorpay (Payment gateway)

## Backend API

### Models

#### User Model
```javascript
{
    name: String,               // Required
    email: String,              // Required, unique, lowercase, trimmed
    password: String,           // Required, min length 6 (stored as hash)
    cartItems: [                // Array of cart items
        {
            quantity: Number,   // Default: 1
            product: ObjectId   // Reference to Product model
        }
    ],
    role: String,               // Enum: ["admin", "customer"], Default: "customer"
    createdAt: Date,            // Automatically added
    updatedAt: Date             // Automatically added
}
```

#### Product Model
```javascript
{
    name: String,               // Required
    description: String,        // Required
    price: Number,              // Required, min: 0
    image: String,              // Required (Cloudinary URL)
    category: String,           // Required
    isFeatured: Boolean,        // Default: false
    createdAt: Date,            // Automatically added
    updatedAt: Date             // Automatically added
}
```

#### Order Model
```javascript
{
    user: ObjectId,             // Reference to User model, required
    products: [                 // Array of ordered products
        {
            product: ObjectId,  // Reference to Product model, required
            quantity: Number,   // Required, min: 1
            price: Number       // Required, min: 0
        }
    ],
    totalAmount: Number,        // Required, min: 0
    razorpayOrderId: String,    // Required, unique
    razorpayPaymentId: String,  // Populated after payment
    razorpaySignature: String,  // Populated after payment verification
    receiptId: String,          // Optional
    coupon: String,             // Optional, applied coupon code
    createdAt: Date,            // Automatically added
    updatedAt: Date             // Automatically added
}
```

#### Coupon Model
```javascript
{
    code: String,               // Required, unique
    discountPercentage: Number, // Required, min: 0, max: 100
    expirationDate: Date,       // Required
    isActive: Boolean,          // Default: true
    userId: ObjectId,           // Reference to User model, required, unique
    createdAt: Date,            // Automatically added
    updatedAt: Date             // Automatically added
}
```

### Authentication & Authorization

The system implements a secure authentication system:

- **Token Generation**: When a user logs in, two tokens are generated:
  - Access token (15 minutes expiry)
  - Refresh token (7 days expiry)

- **Password Security**:
  - Passwords are hashed using bcrypt before storage
  - Custom method for password comparison

- **Token Generation Method**:
  ```javascript
  // User schema method to generate JWT tokens
  generateTokens: function(userId) {
      // Generate access token (15 minutes expiry)
      const accessToken = jwt.sign(
          { userId },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
      );
      
      // Generate refresh token (7 days expiry)
      const refreshToken = jwt.sign(
          { userId },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
      );
      
      return { accessToken, refreshToken };
  }
  ```

- **Token Storage**:
  - Tokens are stored in HTTP-only cookies for client-side security
  - Refresh tokens are also stored in Redis for validation

- **Protection Middleware**:
  - `protectRoute`: Ensures the user is authenticated
  - `adminRoute`: Restricts access to admin-only endpoints

- **Token Refresh Mechanism**:
  - When access tokens expire, refresh tokens can be used to generate new access tokens
  - Implemented through the `/api/auth/refresh-token` endpoint

### Payment Integration

Razorpay integration handles secure payment processing:

- **Order Creation**:
  - Creates a Razorpay order with product details
  - Applies coupon discounts if applicable
  - Generates a unique receipt ID

- **Payment Verification**:
  - Verifies payment signatures to confirm authenticity
  - Creates a new order in the database upon successful payment
  - Deactivates used coupons

- **Reward System**:
  - Automatically generates new coupon codes for large orders (≥₹10,000)
  - Provides 10% discount on future purchases

### Caching Strategy

Redis is used for caching to improve performance:

- **Featured Products**:
  - Caches products marked as featured
  - Invalidates cache when featured status changes

- **Token Storage**:
  - Stores refresh tokens with expiry matching token validity

- **Cache Implementation**:
  - Uses ioredis client connected to Upstash Redis
  - Implements cache invalidation strategies

### Cloud Integration

Cloudinary handles image storage and processing:

- **Image Upload**:
  - Uploads product images to Cloudinary
  - Stores secure URLs in the product database

- **Image Deletion**:
  - Automatically removes images from Cloudinary when products are deleted
  - Prevents orphaned image files

### API Endpoints

#### Authentication
- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Log in an existing user
- `POST /api/auth/logout`: Log out the current user
- `POST /api/auth/refresh-token`: Refresh access token
- `GET /api/auth/profile`: Get current user profile

#### Products
- `GET /api/products`: Get all products (admin only)
- `GET /api/products/featured`: Get featured products
- `GET /api/products/recommendations`: Get recommended products
- `GET /api/products/category/:category`: Get products by category
- `POST /api/products`: Create a new product (admin only)
- `DELETE /api/products/:id`: Delete a product (admin only)
- `PATCH /api/products/:id`: Toggle featured status (admin only)

#### Cart
- `GET /api/cart`: Get cart products
- `POST /api/cart`: Add product to cart
- `PUT /api/cart/:id`: Update product quantity
- `DELETE /api/cart`: Remove product from cart
- `DELETE /api/cart/clear`: Clear cart

#### Coupons
- `GET /api/coupons`: Get active coupon for current user
- `POST /api/coupons/validate`: Validate coupon code

#### Payments & Orders
- `POST /api/payments/create-order`: Create Razorpay order
- `POST /api/payments/verify-payment`: Verify payment and create order

#### Analytics (Admin Only)
- `GET /api/analytics`: Get overall analytics and daily sales data

## Environment Variables

The application uses the following environment variables:

```
# Database Configuration
MONGO_URI=mongodb+srv://your_mongodb_connection_string

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Redis Configuration
UPSTASH_REDIS_URL=your_upstash_redis_url

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Node Environment
NODE_ENV=development
PORT=5000
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-project
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the backend directory
   - Add the required environment variables

4. **Start the backend server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## Security Features

The application implements several security best practices:

- **Password Security**:
  - Passwords are hashed using bcrypt before storage
  - Implemented in pre-save middleware on the User model
  ```javascript
  // Pre-save middleware to hash passwords
  userSchema.pre("save", async function(next) {
      if (this.isModified("password") || this.isNew) {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
      }
      next();
  });
  ```

- **Token Security**:
  - HTTP-only cookies prevent JavaScript access
  - Strict same-site policy prevents CSRF attacks
  - Secure flag ensures HTTPS-only in production

- **Input Validation**:
  - Request data validation before processing
  - Error handling for invalid inputs

- **Payment Security**:
  - Signature verification for payment callbacks
  - Server-side validation of payment information

- **Image Upload Security**:
  - Proper handling of image uploads
  - Cloudinary integration for secure image storage

## Future Enhancements

Potential improvements for future versions:

- **Search Functionality**:
  - Implement product search with filters
  - Add full-text search capabilities

- **Review System**:
  - Allow users to review products
  - Implement rating system

- **Inventory Management**:
  - Track product inventory
  - Low stock notifications

- **Enhanced Analytics**:
  - More detailed sales reports
  - User behavior analysis

- **Subscription Features**:
  - Implement recurring payment options
  - Create subscription-based products

- **Multiple Payment Gateways**:
  - Add support for additional payment methods
  - International payment processing