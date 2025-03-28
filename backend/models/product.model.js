import mongoose from "mongoose"; 

const productSchema = new mongoose.Schema(
    {
        // Product name
        name: {
            type: String, // Data type is String
            required: true, // Product name is mandatory
        },
        // Product description
        description: {
            type: String, // Data type is String
            required: true, // Description is mandatory
        },
        // Product price
        price: {
            type: Number, // Data type is Number
            required: true, // Price is mandatory
            min: 0, // Minimum value is 0 (non-negative pricing)
        },
        // Product image URL
        image: {
            type: String, // Data type is String
            required: [true, "Image is required"], // Mandatory with custom error message
        },
        // Product category
        category: {
            type: String, // Data type is String
            required: true, // Category is mandatory
        },
        // Field indicating if the product is featured
        isFeatured: {
            type: Boolean, // Data type is Boolean
            default: false, // Defaults to false (not featured)
        },
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Create a Mongoose model for the Product schema
const Product = mongoose.model("Product", productSchema);
export default Product;
