import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";


export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        if (!products) return res.status(400).json({ message: "No products found" });
        return res.status(200).json({ products });
    } catch (error) {
        console.log("Error in getAllProducts controller: ", error);
        res.status(500).json({ message: error.message });
    }
}

// Define a controller function to fetch and return featured products
export const getFeaturedProducts = async (req, res) => {
    try {
        // Attempt to retrieve the featured products from Redis (an in-memory data store)
        let featuredProducts = await redis.get("featured_products");

        // If featured products are found in Redis, parse the JSON string into a JavaScript object
        if (featuredProducts) {
            return res.status(200).json(JSON.parse(featuredProducts));
        }

        // If no featured products are found in Redis, query MongoDB to fetch products marked as featured
        // Use the `.lean()` method to retrieve plain JavaScript objects instead of Mongoose documents
        featuredProducts = await Product.find({ isFeatured: true }).lean();

        // Explanation of `.lean()`: 
        // The `.lean()` method is used to optimize performance by returning simple JavaScript objects
        // rather than Mongoose documents, which have additional overhead due to built-in methods and properties.
        // This is particularly useful when you only need to read data without modifying it.

        // If no featured products are found in MongoDB, return a 404 Not Found status
        if (!featuredProducts) return res.status(404).json({ message: "No featured products found" });

        // If featured products are found in MongoDB, store them in Redis for faster access in future requests
        await redis.set("featured_products", JSON.stringify(featuredProducts));

        // Return the featured products with a 200 OK status
        return res.status(200).json(featuredProducts);
    } catch (error) {
        // Log any unexpected errors to the console for debugging purposes
        console.log("Error in getFeaturedProducts controller: ", error);
        // Respond with a 500 Internal Server Error status and an error message
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        let cloudinaryResponse = null;
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }
        
        const product = new Product({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "",
            category
        });
        await product.save();

        return res.status(201).json(product);
    } catch (error) {
        console.log("Error in createProduct controller: ", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
