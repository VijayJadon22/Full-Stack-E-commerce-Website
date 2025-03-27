import Product from "../models/product.model.js";


// Define a controller function to handle adding a product to the user's cart
export const addToCart = async (req, res) => {
    try {
        // Extract the product ID from the request body
        const { productId } = req.body;

        // Retrieve the user object from the request (assumes user is attached by middleware, such as auth middleware)
        const user = req.user;

        // Check if the product is already in the user's cart
        const existingItem = user.cartItems.find(item => item.product === productId);

        // If the product exists in the cart, increase its quantity by 1
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // If the product doesn't exist in the cart, add it with a default quantity of 1
            user.cartItems.push({ product: productId });
        }

        // Save the updated user object to the database
        await user.save();

        // Respond with a success message and the updated list of cart items
        return res.status(200).json({
            message: "Product added to cart successfully",
            cartItems: user.cartItems
        });
    } catch (error) {
        // Log any unexpected errors to the console for debugging purposes
        console.log("Error in addToCart controller: ", error);

        // Respond with a server error status and a meaningful error message
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

// Define a controller function to handle removing a product from the user's cart
export const removeAllFromCart = async (req, res) => {
    try {
        // Extract the 'productId' from the request body
        const { productId } = req.body;
        // Retrieve the currently authenticated user from the request object
        const user = req.user;

        // Check if the product exists in the database by its ID
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Remove the product from the user's cartItems array
        user.cartItems = user.cartItems.filter((item) => item.product !== productId);

        // Save the updated user object to the database
        await user.save();

        return res.status(200).json({
            message: "Product removed from cart successfully",
            cartItems: user.cartItems
        });

    } catch (error) {
        // Log any unexpected errors to the console for debugging purposes
        console.log("Error in removeFromCart controller: ", error);

        // Respond with a 500 Internal Server Error status and an error message
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

