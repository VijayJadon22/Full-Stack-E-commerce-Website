# Trendify - Modern E-Commerce Platform for Trending Fashion

Trendify is a comprehensive full-stack e-commerce platform specializing in trendy fashion products. Built with modern web technologies, it offers a seamless shopping experience with robust backend functionality and an intuitive, responsive frontend interface that prioritizes user experience and sustainability.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Frontend](#frontend)
  - [Pages & Components](#pages--components)
  - [State Management](#state-management)
  - [Animation & UI](#animation--ui)
  - [Routing Structure](#routing-structure)
  - [Component Breakdown](#component-breakdown)
- [Backend API](#backend-api)
  - [Models](#models)
  - [Authentication Flow](#authentication-flow)
  - [Authorization Middleware](#authorization-middleware)
  - [Payment Integration](#payment-integration)
  - [Caching Strategy](#caching-strategy)
  - [Cloud Integration](#cloud-integration)
  - [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Development Workflow](#development-workflow)
- [Security Features](#security-features)
- [Testing](#testing)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Overview

Trendify is a feature-rich e-commerce platform designed for performance, security, and scalability. The application combines a React-based frontend with a Node.js/Express backend, MongoDB database, and integrates several third-party services to deliver a complete shopping solution focused on eco-friendly fashion products.

The platform aims to promote tredning fashion while providing a modern shopping experience with intuitive navigation, secure payment processing, and personalized user experiences through features like recommendations and coupons.

## Features

### User Management
- **Secure Registration & Authentication**: Complete signup and login functionality with JWT-based authentication
- **Role-based Access Control**: Different permissions for admin and customer roles
- **Profile Management**: Users can view and update their profile information
- **Password Security**: Bcrypt hashing for secure password storage

### Product Management
- **Category Navigation**: Browse products across different categories (Jeans, T-shirts, Shoes, Glasses, Jackets, Suits, Bags)
- **Featured Products**: Highlighted products showcase on the homepage
- **Product Recommendations**: Personalized product suggestions based on browsing history
- **Product Details**: Comprehensive product information including description, price, and images

### Shopping Cart
- **Cart Management**: Add, update quantity, and remove products from cart
- **Persistent Cart**: Cart items are saved to user profile
- **Real-time Updates**: Cart totals update dynamically
- **Multi-item Support**: Handle multiple products with different quantities

### Order Processing
- **Seamless Checkout**: Streamlined checkout process
- **Secure Payments**: Integration with Razorpay payment gateway

### Coupon System
- **Discount Application**: Apply coupon codes during checkout
- **Validation Logic**: Server-side validation of coupon validity
- **Automatic Coupon Generation**: Reward system for large orders (≥₹10,000)
- **User-specific Coupons**: Personalized discount codes tied to user accounts

### Analytics (Admin Only)
- **Sales Dashboard**: Overview of business performance
- **Revenue Metrics**: Track total and periodic revenue
- **User Statistics**: Monitor user growth and activity
- **Daily Sales Data**: Day-by-day breakdown of sales performance
- **Visual Charts**: Graphical representation of key metrics

### UI/UX Features
- **Responsive Design**: Optimized for all device sizes from mobile to desktop
- **Smooth Animations**: Engaging transitions and animations using Framer Motion
- **Consistent Theme**: Modern, eco-friendly visual design throughout
- **Loading States**: Custom spinner and loading indicators for asynchronous operations
- **Toast Notifications**: User feedback through non-intrusive notifications

## System Architecture

### Frontend Architecture

The frontend is built using a component-based architecture with React, featuring:

- **Component Structure**: Modular components with clear separation of concerns
- **Custom Hooks**: State management through specialized hooks
- **React Router**: Client-side routing with protected routes
- **Animation Layer**: Framer Motion for consistent animations
- **Form Handling**: Controlled components with validation
- **Responsive Design**: Mobile-first approach using Tailwind CSS classes

#### Technology Stack
- **React**: Core UI library for building the interface
- **React Router Dom**: Navigation and routing management
- **Framer Motion**: Animation library for smooth transitions
- **Lucide React**: Lightweight icon components
- **React Hot Toast**: Non-intrusive notification system
- **Custom Store Hooks**: Lightweight state management solution

### Backend Architecture

The backend follows an MVC-inspired architecture:

- **RESTful API Design**: Well-structured endpoints following REST principles
- **Middleware Chain**: Request processing through specialized middleware
- **Controller Logic**: Business logic separated into controller functions
- **Model Layer**: Data structures and database interaction
- **Service Layer**: Specialized services for external integrations
- **Caching Layer**: Performance optimization through Redis caching

#### Technology Stack
- **Node.js & Express**: Server runtime and framework
- **MongoDB & Mongoose**: NoSQL database and ODM
- **JSON Web Tokens**: Authentication mechanism
- **Redis (via Upstash)**: Caching solution
- **Cloudinary**: Cloud-based image management
- **Razorpay**: Payment processing gateway
- **bcrypt**: Password hashing

## Frontend

### Pages & Components

#### Pages
- **HomePage (`HomePage.jsx`)**: 
  - Central landing page featuring category navigation
  - Showcases featured products
  - Provides quick access to popular categories
  - Implements responsive layout for all devices

- **CategoryPage (`CategoryPage.jsx`)**: 
  - Displays products filtered by selected category
  - Dynamic title updates based on category name
  - Handles loading states and empty results
  - Animated product grid using Framer Motion

- **LoginPage (`LoginPage.jsx`)**: 
  - User authentication form
  - Form validation with error handling
  - Redirect logic for authenticated users
  - Loading state during authentication process

- **SignupPage (`SignupPage.jsx`)**: 
  - New user registration
  - Password confirmation validation
  - Form field validation with error notifications
  - Animated transitions for form elements

#### Components
- **ProductCard**: 
  - Displays individual product information
  - Handles product image loading
  - "Add to cart" functionality
  - Price and product name display

- **CategoryItem**: 
  - Visual representation of product categories
  - Background image with overlay
  - Navigation link to category page
  - Hover animations

- **FeaturedProducts**: 
  - Carousel of highlighted products
  - Special styling for featured items
  - Responsive grid layout
  - Optimized image loading

- **LoadingSpinner**: 
  - Visual indicator during async operations
  - Animated SVG implementation
  - Consistent styling with application theme
  - Conditionally rendered based on loading state

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
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
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








