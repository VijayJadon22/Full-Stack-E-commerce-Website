import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon); // Route to get the user's active coupon
router.get("/validate", protectRoute, validateCoupon); // Route to validate a specific coupon provided by the user

export default router;
