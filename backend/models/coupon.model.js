import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        // Coupon code (must be unique)
        code: {
            type: String, // String type for the coupon code
            required: true, // Coupon code is mandatory
            unique: true, // Each coupon code must be unique
        },
        // Discount percentage for the coupon
        discountPercentage: {
            type: Number, // Numerical value for the discount percentage
            required: true, // Discount percentage is mandatory
            min: 0, // Minimum value is 0%
            max: 100, // Maximum value is 100%
        },
        // Expiration date for the coupon
        expirationDate: {
            type: Date, // Date type to track when the coupon expires
            required: true, // Expiration date is mandatory
        },
        // Field to indicate whether the coupon is active
        isActive: {
            type: Boolean, // Boolean value (true or false)
            default: true, // Defaults to true (active) when a coupon is created
        },
        // User ID associated with the coupon
        userId: {
            type: mongoose.Schema.Types.ObjectId, // ObjectId referencing the User model
            ref: "User", // Reference to the "User" collection
            required: true, // The coupon must be linked to a specific user
            unique: true, // Ensures a single coupon is active per user at a time
        },
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Create a Mongoose model for the Coupon schema
const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
