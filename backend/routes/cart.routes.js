import express from "express";
import { getCartProducts, addToCart, removeAllFromCart, updateQuantity, clearCart } from "../controllers/cart.controller.js";

// Import a middleware function to protect routes, ensuring only authenticated users can access them
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


// Protected by the 'protectRoute' middleware to ensure the user is authenticated
router.get("/", protectRoute, getCartProducts); // Route to fetch all products in the user's cart

router.post("/", protectRoute, addToCart); // Route to add a product to the user's cart

router.delete("/", protectRoute, removeAllFromCart); // Route to remove all products from the user's cart

router.delete("/clear", protectRoute, clearCart);

router.put("/:id", protectRoute, updateQuantity); // Route to update the quantity of a specific product in the cart

export default router;
