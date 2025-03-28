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


// Function to verify Razorpay payment and create a new order
export const verifyRazorpayPayment = async (req, res) => {
    try {
        // Extract Razorpay payment details from the request body
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        // Generate server-side signature for verification using the secret key
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) // Use SHA-256 hashing algorithm
            .update(razorpayOrderId + "|" + razorpayPaymentId) // Concatenate order ID and payment ID
            .digest("hex"); // Generate the hash as a hexadecimal string

        // Compare the generated signature with the one sent by Razorpay
        if (generatedSignature !== razorpaySignature) {
            return res.status(400).json({ error: "Payment verification failed" }); // Return error if signatures don't match
        }

        // Fetch Razorpay order details to retrieve metadata (notes)
        const orderDetails = await razorpay.orders.fetch(razorpayOrderId);
        const notes = orderDetails.notes; // Extract notes field for additional metadata

        // Deactivate the used coupon if applicable
        if (notes.couponCode) {
            await Coupon.findOneAndUpdate(
                { code: notes.couponCode, userId: notes.userId }, // Match coupon by code and user ID
                { isActive: false } // Mark the coupon as inactive
            );
        }

        // Parse product details stored in Razorpay notes
        const products = JSON.parse(notes.products);

        // Create a new order in the database after successful payment verification
        const newOrder = new Order({
            user: notes.userId, // Reference the user ID from notes
            products: products.map((product) => ({
                product: product.productId, // Product ID reference
                quantity: product.quantity, // Quantity purchased
                price: product.price / 100, // Convert price back to INR for storage
            })),
            totalAmount: orderDetails.amount / 100, // Convert total amount back to INR
            razorpayOrderId: razorpayOrderId, // Save Razorpay Order ID for reference
            razorpayPaymentId: razorpayPaymentId, // Save Razorpay Payment ID for reference
            razorpaySignature: razorpaySignature, // Store verified signature
            receiptId: orderDetails.receipt, // Save the unique receipt ID
            coupon: notes.couponCode || null, // Store coupon code if applied
        });

        // Save the new order in the database
        await newOrder.save();

        // Return success response with order details
        res.status(200).json({
            success: true,
            message: "Payment verified successfully and order created.",
            orderId: newOrder._id, // Return the order ID for frontend reference
            paymentId: razorpayPaymentId, // Include the payment ID for clarity
            totalAmount: orderDetails.amount / 100, // Convert total amount back to INR
        });

    } catch (error) {
        // Log and handle errors
        console.error("Error verifying Razorpay payment:", error);
        res.status(500).json({ error: "Error verifying Razorpay payment", details: error.message });
    }
};

// Function to create a new coupon for a specific user

