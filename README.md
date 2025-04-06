# Trendify - Modern E-Commerce Platform

Trendify is a comprehensive full-stack e-commerce platform specializing in eco-friendly fashion. Built with modern web technologies, it offers a seamless shopping experience with robust backend functionality and an intuitive, responsive frontend interface.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Frontend](#frontend)
  - [Pages & Components](#pages--components)
  - [State Management](#state-management)
  - [Animation & UI](#animation--ui)
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

Trendify is a feature-rich e-commerce platform designed for performance, security, and scalability. The application combines a React-based frontend with a Node.js/Express backend, MongoDB database, and integrates several third-party services to deliver a complete shopping solution.

## Features

### User Management
- Signup, login, profile management with JWT authentication
- Role-based access control (admin/customer)
- Secure password handling

### Product Management
- Browse products by category (Jeans, T-shirts, Shoes, Glasses, Jackets, Suits, Bags)
- Featured product showcase
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

### Analytics (Admin Only)
- Total sales tracking
- Revenue analysis
- User statistics
- Daily sales data

### UI/UX Features
- Responsive design that works on all devices
- Smooth animations using Framer Motion
- Modern, eco-friendly branding
- Loading states with custom spinners

## System Architecture

### Frontend
- **React**: UI library
- **React Router**: Navigation and routing
- **Framer Motion**: Animation library
- **Lucide React**: Icon components
- **React Hot Toast**: Notifications
- **Custom Store**: State management using custom hooks

### Backend
- **Node.js & Express**: Server framework
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Authentication
- **Redis**: Caching (via Upstash)
- **Cloudinary**: Image storage
- **Razorpay**: Payment gateway

## Frontend

### Pages & Components

#### Pages
- **HomePage**: Features category navigation and featured products
- **CategoryPage**: Displays products filtered by category
- **LoginPage**: User login functionality
- **SignupPage**: New user registration

#### Components
- **ProductCard**: Displays individual product information
- **CategoryItem**: Navigate to product categories
- **FeaturedProducts**: Showcase of highlighted products
- **LoadingSpinner**: Displays during async operations

### State Management

The frontend uses custom store hooks for state management:

- **useProductStore**: Manages product data and fetching
  - `fetchProductsByCategory`: Load products from specific category
  - `fetchFeaturedProducts`: Load featured products

- **useUserStore**: Handles user authentication
  - `login`: User login functionality
  - `signup`: New user registration
  - User state tracking

### Animation & UI

- **Framer Motion**: Implements smooth animations throughout the application
- **Responsive Design**: Tailwind classes ensure the app works on all device sizes
- **Modern Icons**: Lucide React icons for enhanced UI elements
- **Form Validation**: Client-side validation for login and signup forms

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

- **Token Storage**:
  - Tokens are stored in HTTP-only cookies for client-side security
  - Refresh tokens are also stored in Redis for validation

- **Protection Middleware**:
  - `protectRoute`: Ensures the user is authenticated
  - `adminRoute`: Restricts access to admin-only endpoints

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

### Backend
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

### Frontend
```
# API Base URL
REACT_APP_API_URL=http://localhost:5000/api

# Razorpay Key (Client)
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trendify
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   # Create .env file with required variables
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   # Create .env file with required variables
   npm start
   ```

4. **Access the application**
   - Backend API: http://localhost:5000
   - Frontend App: http://localhost:3000

## Security Features

The application implements several security best practices:

- **Password Security**:
  - Passwords are hashed using bcrypt before storage
  - Implemented in pre-save middleware on the User model

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

- **Additional Frontend Pages**:
  - Product detail pages
  - Admin dashboard
  - Order history page

---

Developed with ❤️ for eco-friendly fashion