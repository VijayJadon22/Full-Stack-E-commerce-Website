// Import necessary libraries and components
import React from "react"; // Core React library for creating components
import { useCartStore } from "../stores/useCartStore.js"; // Zustand store for managing cart state
import { motion } from "framer-motion"; // Framer Motion for animations
import { Link } from "react-router-dom"; // React Router's Link component for navigation
import { ShoppingCart } from "lucide-react"; // Icon for the "empty cart" UI
import CartItem from "../components/CartItem.jsx"; // Component to render individual cart items
import PeopleAlsoBought from "../components/PeopleAlsoBought.jsx"; // Component to display product recommendations
import OrderSummary from "../components/OrderSummary.jsx"; // Component to display price breakdown and payment info
import GiftCouponCard from "../components/GiftCouponCard.jsx"; // Component for applying coupon codes

// CartPage Component: Displays the shopping cart page with cart items, recommendations, and order details
const CartPage = () => {
  // Access cart state from Zustand store
  const { cart } = useCartStore(); // Retrieve the cart items

  // Render the cart page UI
  return (
    <div className="py-8 md:pt-0 md:pb-8">
      {" "}
      {/* Page padding */}
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        {" "}
        {/* Centered and responsive container */}
        <div className="md:gap-6 lg:flex lg:items-start xl:gap-24">
          {" "}
          {/* Responsive layout for cart details and order summary */}
          {/* Cart Items Section */}
          <motion.div
            className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-3xl" // Style for cart items container
            initial={{ opacity: 0, x: -20 }} // Initial animation state: fade in and slide from left
            animate={{ opacity: 1, x: 0 }} // Final animation state: fully visible at original position
            transition={{ duration: 0.5, delay: 0.2 }} // Smooth animation with slight delay
          >
            {/* If the cart is empty, display the empty cart UI */}
            {cart.length === 0 ? (
              <EmptyCartUI />
            ) : (
              <div className="space-y-6">
                {" "}
                {/* Space between cart items */}
                {/* Render individual cart items */}
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            )}
            {/* Show product recommendations if the cart is not empty */}
            {cart.length > 0 && <PeopleAlsoBought />}
          </motion.div>
          {/* Order Summary and Coupon Section */}
          {cart.length > 0 && (
            <motion.div
              className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full" // Style for the order summary container
              initial={{ opacity: 0, x: 20 }} // Initial animation state: fade in and slide from right
              animate={{ opacity: 1, x: 0 }} // Final animation state: fully visible at original position
              transition={{ duration: 0.5, delay: 0.4 }} // Smooth animation with slightly more delay
            >
              <OrderSummary /> {/* Render OrderSummary component */}
              <GiftCouponCard /> {/* Render GiftCouponCard component */}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage; // Export the CartPage component for use elsewhere

// EmptyCartUI Component: Displays a message when the cart is empty
const EmptyCartUI = () => (
  <motion.div
    className="flex flex-col items-center justify-center space-y- py-2" // Style for empty cart container
    initial={{ opacity: 0, y: -20 }} // Initial animation state: fade in and slide from top
    animate={{ opacity: 1, y: 0 }} // Final animation state: fully visible at original position
    transition={{ duration: 0.5 }} // Smooth animation duration
  >
    <ShoppingCart className="h-24 w-24 text-gray-600" />{" "}
    {/* Shopping cart icon */}
    <h3 className="text-2xl font-semibold text-gray-600">
      Your cart is empty
    </h3>{" "}
    {/* Header text */}
    <p className="text-gray-600">
      {" "}
      {/* Subtext */}
      Looks like you {"haven't"} added anything to your cart yet.
    </p>
    <Link
      className="mt-4 rounded-md bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600" // Style for "Start Shopping" button
      to="/" // Redirect to the home page when clicked
    >
      Start Shopping
    </Link>
  </motion.div>
);
