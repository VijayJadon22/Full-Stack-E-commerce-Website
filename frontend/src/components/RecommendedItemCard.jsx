import React from "react"; // Core React library for creating components
import toast from "react-hot-toast"; // Library for displaying toast notifications
import { ShoppingCart } from "lucide-react"; // Icon for the "Add to cart" button
import { useUserStore } from "../stores/useUserStore.js"; // Zustand store to manage user state
import { useCartStore } from "../stores/useCartStore.js"; // Zustand store to manage cart state

// RecommendedItemCard Component: Displays product details and provides an "Add to cart" button
const RecommendedItemCard = ({ product }) => {
  // Zustand store hooks
  const { user } = useUserStore(); // Retrieve current user data
  const { addToCart } = useCartStore(); // Function to add a product to the cart

  // Function to handle "Add to Cart" button click
  const handleAddToCart = () => {
    // Check if the user is logged in
    if (!user) {
      // Show error toast if the user is not logged in
      toast.error("Please login to add to cart", { id: "addToCart" });
      return;
    } else {
      // Call the `addToCart` function with the product data
      addToCart(product);
    }
  };

  // Render the UI for the recommended item card
  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg shadow shadow-gray-500">
      {/* Product image container */}
      <div className="relative mx-3 mt-3 flex h-28 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full" // Ensures the image fills the container while maintaining aspect ratio
          src={product.image} // Source URL for the product image
          alt="product image" // Alt text for accessibility
        />
        {/* Dark overlay for better text contrast (if added later) */}
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      {/* Product details container */}
      <div className="mt-4 px-5 pb-5">
        {/* Product name */}
        <h5 className="text-lg font-semibold tracking-tight text-gray-600">
          {product.name} {/* Display the product's name */}
        </h5>

        {/* Product price */}
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-sm font-bold text-gray-600">
              ₹{product.price}{" "}
              {/* Display the product's price with the ₹ symbol */}
            </span>
          </p>
        </div>

        {/* "Add to Cart" button */}
        <button
          className="flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-center text-sm font-medium
                     text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          onClick={handleAddToCart} // Call the `handleAddToCart` function when clicked
        >
          <ShoppingCart size={14} className="mr-2" /> {/* Shopping cart icon */}
          Add to cart {/* Button label */}
        </button>
      </div>
    </div>
  );
};

// Export the RecommendedItemCard component for use in other parts of the application
export default RecommendedItemCard;
