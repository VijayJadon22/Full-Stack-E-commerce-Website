import { razorpay } from "../lib/razorpay.js"; // Import configured Razorpay instance
import Coupon from "../models/coupon.model.js"; // Import Coupon model
import { v4 as uuidv4 } from "uuid"; // Import UUID for generating unique receipt IDs
import crypto from "crypto"; // Import crypto library for signature verification
import Order from "../models/order.model.js"; // Import Order model to save order details

// Function to create a Razorpay order
export const createRazorpayOrder = async (req, res) => {
    try {
        // Extract products and couponCode from the request body
        const { products, couponCode } = req.body;

        // Validate that the products is array and products array is not empty
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
        }

        // Initialize totalAmount to calculate the total order value
        let totalAmount = 0;
        const productDetails = products.map((product) => {
            // Convert product price to paisa (smallest unit in INR) and calculate total amount
            const amount = Math.round(product.price * 100);
            totalAmount += amount * product.quantity;

            // Return structured product details for further processing
            return {
                productId: product._id,
                name: product.name,
                price: amount, // Price in paisa
                quantity: product.quantity || 1, // Default to 1 if quantity is not provided
                image: product.image, // Product image URL (optional)
            };
        });

        // Check for a valid coupon and apply a discount if found
        let coupon = null;
        if (couponCode) {
            // Fetch the coupon based on code and user ID, ensuring it's active
            coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
            if (coupon) {
                //Subtract the discount percentage amount from the total amount
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
            }
        }

        // Generate a unique receipt ID using UUID
        const receiptId = `receipt_${uuidv4()}`;

        // Define Razorpay order options, including metadata in the notes field
        const options = {
            amount: totalAmount, // Total amount in paisa
            currency: "INR", // Set currency to Indian Rupee
            receipt: receiptId, // Unique receipt ID for tracking
            notes: {
                userId: req.user._id.toString(), // Add user ID for reference
                couponCode: couponCode || "", // Include coupon code if provided
                products: JSON.stringify(productDetails), // Serialize product details
            },
        };

        // Create a Razorpay order using the API
        const order = await razorpay.orders.create(options);

        // Check if a new coupon should be created (order total >= ₹10,000)
        if (totalAmount >= 1000000) { // 10,000 INR in paisa
            await createNewCoupon(req.user._id); // Generate a new coupon for the user for the next order
        }

        // Return the Razorpay Order ID, total amount, and receipt ID to the frontend
        return res.status(200).json({
            id: order.id,
            amount: totalAmount / 100, // Convert amount back to INR for readability
            receiptId: receiptId, // Include the unique receipt ID
        });

    } catch (error) {
        // Log and handle errors
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Error creating Razorpay order", details: error.message });
    }
};



