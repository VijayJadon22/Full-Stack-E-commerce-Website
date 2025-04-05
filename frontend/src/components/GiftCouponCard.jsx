import React, { useEffect, useState } from "react"; // React core functionality and hooks
import { useCartStore } from "../stores/useCartStore"; // Zustand store for managing cart-related state and actions
import { motion } from "framer-motion"; // Framer Motion for adding animations

// Displays a UI for users to enter and apply a coupon code. Allows users to remove applied coupons as well.
const GiftCouponCard = () => {
  // State variable to track the user's inputted coupon code
  const [userInputCode, setUserInputCode] = useState("");

  // Access Zustand store actions and state
  const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } =
    useCartStore();

  // Fetches the user's coupon information when the component is mounted
  useEffect(() => {
    getMyCoupon(); // Zustand action to retrieve the current coupon (if any)
  }, [getMyCoupon]);

  // Updates the user's input code if a coupon is already applied
  useEffect(() => {
    if (coupon) setUserInputCode(coupon.code); // Auto-fill the code if there's an applied coupon
  }, [coupon]);

  // Handles the action to apply the entered coupon code
  const handleApplyCoupon = () => {
    if (!userInputCode) return; // Don't apply if input is empty
    applyCoupon(userInputCode); // Zustand action to validate and apply the coupon
  };

  // Handles the action to remove the currently applied coupon
  const handleRemoveCoupon = async () => {
    await removeCoupon(); // Zustand action to remove the coupon
    setUserInputCode(""); // Clear the user input after coupon removal
  };

  // Render the GiftCouponCard UI
  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }} // Initial state: Hidden and moved down
      animate={{ opacity: 1, y: 0 }} // Final state: Fully visible at original position
      transition={{ duration: 0.5, delay: 0.2 }} // Smooth animation with a slight delay
    >
      {/* Input Field for entering coupon code */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="voucher"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Do you have a coupon or gift voucher?
          </label>
          <input
            type="text"
            id="voucher"
            className="block w-full rounded-lg border border-gray-600 bg-gray-700 
            p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 
            focus:ring-emerald-500" // Tailwind styling for input field
            placeholder="Enter code here" // Placeholder text to guide the user
            value={userInputCode} // Controlled input value from state
            onChange={(e) => setUserInputCode(e.target.value)} // Update state when user types
            required // Ensure the field is filled before submission
          />
        </div>

        {/* Button to apply the coupon */}
        <motion.button
          type="button"
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }} // Slight scale-up on hover for a dynamic effect
          whileTap={{ scale: 0.95 }} // Scale-down effect on button press
          onClick={handleApplyCoupon} // Call function to apply coupon on click
        >
          Apply Code
        </motion.button>
      </div>

      {/* Section to display applied coupon details */}
      {coupon && isCouponApplied && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">Applied Coupon</h3>
          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discountPercentage}% off{" "}
            {/* Show coupon code and discount */}
          </p>

          {/* Button to remove the applied coupon */}
          <motion.button
            type="button"
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
            px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none
             focus:ring-4 focus:ring-red-300"
            whileHover={{ scale: 1.05 }} // Slight scale-up on hover
            whileTap={{ scale: 0.95 }} // Scale-down effect on button press
            onClick={handleRemoveCoupon} // Call function to remove coupon on click
          >
            Remove Coupon
          </motion.button>
        </div>
      )}

      {/* Section to display available coupon details */}
      {coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">
            Your Available Coupon:
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discountPercentage}% off{" "}
            {/* Show available coupon code and discount */}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard; // Export the component for use elsewhere
