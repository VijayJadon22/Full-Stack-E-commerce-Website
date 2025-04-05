import { Minus, Plus, Trash } from "lucide-react"; // Importing icon components for buttons (Minus, Plus, Trash icons)
import { useCartStore } from "../stores/useCartStore.js"; // Zustand store for managing cart-related state and actions

// CartItem: Functional component to render an individual cart item
const CartItem = ({ item }) => {
  // Zustand functions for cart actions
  const { removeFromCart, updateQuantity } = useCartStore(); // `removeFromCart` removes the item, and `updateQuantity` adjusts its quantity

  // Return JSX to display cart item with actions
  return (
    <div className="rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:py-2">
      {/* Wrapper for item layout */}
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        {/* Product Image */}
        <div className="shrink-0 md:order-1">
          {" "}
          {/* Ensures image remains fixed in responsive layout */}
          <img
            className="h-20 md:h-18 rounded object-cover" // Responsive height, rounded corners for aesthetics
            src={item.image} // Display product image passed via `item` prop
          />
        </div>
        <label className="sr-only">Choose quantity:</label>{" "}
        {/* Hidden label for accessibility */}
        {/* Quantity Selector and Price */}
        <div className="flex items-center justify-between md:order-3 md:justify-end">
          {/* Quantity Adjustment Buttons */}
          <div className="flex items-center gap-2">
            {" "}
            {/* Align buttons and quantity value */}
            <button
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border 
                             border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 
                             focus:ring-emerald-500" // Styling for button with hover effects
              onClick={() => updateQuantity(item._id, item.quantity - 1)} // Decrease quantity
            >
              <Minus className="text-gray-300" /> {/* Minus icon */}
            </button>
            <p>{item.quantity}</p> {/* Display current quantity */}
            <button
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
                             border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none 
                             focus:ring-2 focus:ring-emerald-500" // Styling for button with hover effects
              onClick={() => updateQuantity(item._id, item.quantity + 1)} // Increase quantity
            >
              <Plus className="text-gray-300" /> {/* Plus icon */}
            </button>
          </div>

          {/* Product Price */}
          <div className="text-end md:order-4 md:w-32">
            {" "}
            {/* Align price to the right */}
            <p className="text-base font-bold text-emerald-400">
              ₹{item.price} {/* Display price formatted with currency */}
            </p>
          </div>
        </div>
        {/* Product Details */}
        <div className="w-full min-w-0 flex-1 space-y-2 md:order-2 md:max-w-md">
          {" "}
          {/* Product name and description */}
          {/* Product Name */}
          <p className="text-base font-medium text-white hover:text-emerald-400 hover:underline">
            {item.name} {/* Display product name */}
          </p>
          {/* Product Description */}
          <p className="text-sm text-gray-400">{item.description}</p>{" "}
          {/* Display product description */}
          {/* Remove from Cart Button */}
          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center text-sm font-medium text-red-400
                             hover:text-red-300 hover:underline" // Styling for "Remove" button with hover effects
              onClick={() => removeFromCart(item._id)} // Remove item from cart
            >
              <Trash size={16} /> {/* Trash icon */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem; // Export component for usage in other parts of the application
