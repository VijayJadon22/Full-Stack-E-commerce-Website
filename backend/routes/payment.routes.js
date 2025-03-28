import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js"; 
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/payment.controller.js";

const router = express.Router();

// Route to create a Razorpay order
// This route:
// - Requires authentication via the protectRoute middleware
// - Calls the createRazorpayOrder controller to create and return a Razorpay order
router.post("/create-order", protectRoute, createRazorpayOrder);

// Route to verify Razorpay payment
// This route:
// - Requires authentication via the protectRoute middleware
// - Calls the verifyRazorpayPayment controller to verify payment details
// - Ensures that payment signatures are authenticated before processing the order
router.post("/verify-payment", protectRoute, verifyRazorpayPayment);

export default router;
