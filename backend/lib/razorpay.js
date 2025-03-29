// Import the Razorpay SDK to interact with Razorpay APIs
import Razorpay from "razorpay";

// Import dotenv to load environment variables from a .env file
import dotenv from "dotenv";

// Load environment variables from the .env file into process.env
dotenv.config();

// Create and export a Razorpay instance configured with credentials
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Razorpay Key ID (public API key) from .env file
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Razorpay Key Secret (private API key) from .env file
});
