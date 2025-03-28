import mongoose, { mongo } from "mongoose"; 

const orderSchema = new mongoose.Schema(
    {
        // Reference to the user placing the order
        user: {
            type: mongoose.Schema.Types.ObjectId, // ObjectId reference to the User model
            ref: "User", // Specifies the User collection
            required: true, // Ensures every order is associated with a user
        },
        // Array of products in the order
        products: [
            {
                // Reference to a specific product in the order
                product: {
                    type: mongoose.Schema.Types.ObjectId, // ObjectId reference to the Product model
                    ref: "Product", // Specifies the Product collection
                    required: true, // Ensures every item has a valid product reference
                },
                // Quantity of the product purchased
                quantity: {
                    type: Number, // Numerical value for quantity
                    required: true, // Quantity is mandatory
                    min: 1, // Minimum value is 1
                },
                // Price of the product at the time of order (in INR)
                price: {
                    type: Number, // Numerical value for price
                    required: true, // Price is mandatory
                    min: 0, // Minimum price is 0
                },
            },
        ],
        // Total amount for the order (in INR)
        totalAmount: {
            type: Number, // Numerical value for the total amount
            required: true, // Total amount is mandatory
            min: 0, // Minimum value is 0
        },
        // Razorpay Order ID (generated during order creation)
        razorpayOrderId: {
            type: String, // String type to store Razorpay Order ID
            required: true, // Razorpay Order ID is mandatory
            unique: true, // Ensures no duplicate orders
        },
        // Razorpay Payment ID (generated after successful payment)
        razorpayPaymentId: {
            type: String, // String type to store Razorpay Payment ID
        },
        // Razorpay Signature (provided for payment verification)
        razorpaySignature: {
            type: String, // String type to store Razorpay Signature
        },
        // Unique receipt identifier (optional, generated during order creation)
        receiptId: {
            type: String, // String type for receipt ID
        },
        // Coupon code applied (optional)
        coupon: {
            type: String, // String type for coupon code
        },
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Create a Mongoose model for the Order schema
const Order = mongoose.model("Order", orderSchema);

// Export the model for use in other parts of the application
export default Order;
