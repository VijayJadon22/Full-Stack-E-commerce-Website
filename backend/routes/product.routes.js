import express from "express";
import { getAllProducts, getFeaturedProducts, createProduct, deleteProduct, getRecommendedProducts, getProductsByCategory, toggleFeaturedProduct } from "../controllers/product.controller.js";

// Import authentication and authorization middleware functions
// 'protectRoute' ensures only authenticated users can access protected routes
// 'adminRoute' ensures only users with admin privileges can access specific routes
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route to fetch all products (accessible only to authenticated admins)
router.get("/", protectRoute, adminRoute, getAllProducts);

router.get("/featured", getFeaturedProducts);  // Route to fetch featured products, without authentication or admin protection, making it accessible to everyone

router.get("/category/:category", getProductsByCategory); // Route to fetch products by category

router.get("/recommendations", getRecommendedProducts); // Route to fetch recommended products, a random set of products, accessible to everyone

router.post("/", protectRoute, adminRoute, createProduct); // Route to create a new product (accessible only to authenticated admins)

router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct); // Route to toggle the 'isFeatured' status of a product by ID (accessible only to authenticated admins)

router.delete("/:id", protectRoute, adminRoute, deleteProduct); // Route to delete a product by ID (accessible only to authenticated admins)

export default router;
