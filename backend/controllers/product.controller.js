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

// Define a controller function to create a new product
export const createProduct = async (req, res) => {
    try {
        // Destructure the required fields from the request body, which contains product details
        const { name, description, price, image, category } = req.body;

        // Initialize a variable to store the response from Cloudinary (a cloud-based image hosting service)
        let cloudinaryResponse = null;

        // If an image is provided in the request, upload it to Cloudinary and set the folder as "products"
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }

        // Create a new product instance using the Product model
        // If the image was uploaded to Cloudinary, use its secure URL; otherwise, set the image field as an empty string
        const product = new Product({
            name, // Product name
            description, // Product description
            price, // Product price
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "", // Secure URL of the uploaded image or empty string
            category // Product category
        });

        // Save the new product instance to the database
        await product.save();

        // Respond with a 201 Created status and the newly created product object
        return res.status(201).json(product);
    } catch (error) {
        // Log any unexpected errors to the console for debugging purposes
        console.log("Error in createProduct controller: ", error);

        // Respond with a 500 Internal Server Error status and an error message
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Define a controller function to delete a product
export const deleteProduct = async (req, res) => {
    try {
        // Extract the product ID from the request parameters
        const productId = req.params.id;
        // Find the product by ID in the database
        const product = await Product.findById(productId);

        // If the product does not exist, return a 404 Not Found status with an error message
        if (!product) return res.status(404).json({ message: "Product not found" });

        // If the product has an associated image, proceed to delete the image from Cloudinary
        if (product.image) {
            // Extract the public ID of the image from its URL for deletion from Cloudinary
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                // Use Cloudinary's uploader to delete the image, specifying its public ID and folder
                cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted from Cloudinary");
            } catch (error) {
                // Log any errors that occur during image deletion for debugging purposes
                console.log("Error deleting image from Cloudinary: ", error);
            }
        }
        // Delete the product from the database by its ID
        await Product.findByIdAndDelete(productId);
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        // Log any unexpected errors to the console for debugging purposes
        console.log("Error in deleteProduct controller: ", error);
        // Respond with a 500 Internal Server Error status and an error message
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Define a controller function to retrieve recommended products
export const getRecommendedProducts = async (req, res) => {
    try {
        // Use MongoDB's aggregation framework to fetch products
        const products = await Product.aggregate([
            {
                // Select a random sample of 3 products from the collection
                $sample: { size: 3 }
            },
            {
                // Project (select) only specific fields to include in the results
                $project: {
                    _id: 1,           // Include the product's ID
                    name: 1,         // Include the product's name
                    description: 1,  // Include the product's description
                    image: 1,        // Include the product's image URL
                    price: 1         // Include the product's price
                }
            }
        ]);
        // Return the recommended products as a JSON response with a 200 OK status
        return res.status(200).json(products);
    } catch (error) {
        // Log any unexpected errors to the console for debugging purposes
        console.log("Error in getRecommendedProducts controller: ", error);

        // Respond with a 500 Internal Server Error status and the error message
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Define a controller function to retrieve products by category
export const getProductsByCategory = async (req, res) => {
    // Extract the category parameter from the request's route parameters
    const { category } = req.params;

    try {
        // Query the database for products that match the specified category
        const products = await Product.find({ category });

        // Return the matching products as a JSON response with a 200 OK status
        return res.status(200).json(products);
    } catch (error) {
        // Log any unexpected errors to the console for debugging purposes
        console.log("Error in getProductsByCategory controller: ", error);

        // Respond with a 500 Internal Server Error status and an error message
        return res.status(500).json({ message: error.message });
    }
};



