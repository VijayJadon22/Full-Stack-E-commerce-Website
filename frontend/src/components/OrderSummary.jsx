// Import required modules and libraries
import { motion } from "framer-motion"; // For animation effects
import { useCartStore } from "../stores/useCartStore.js"; // Zustand store for cart management
import { Link } from "react-router-dom"; // For navigation links
import { MoveRight } from "lucide-react"; // Icon for "Continue Shopping" link
import toast from "react-hot-toast"; // For displaying toast notifications
import axios from "../lib/axios"; // Axios instance for API requests
import { useUserStore } from "../stores/useUserStore.js"; // Zustand store for user management

// Helper function to dynamically load Razorpay's script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script"); // Create a script element
    script.src = "https://checkout.razorpay.com/v1/checkout.js"; // Razorpay script URL
    script.onload = () => resolve(true); // Resolve promise when script loads successfully
    script.onerror = () => resolve(false); // Resolve promise when script fails to load
    document.body.appendChild(script); // Append script to the document body
  });
};

// Main component: OrderSummary
const OrderSummary = () => {
  // Access state and actions from Zustand stores
  const { cart, total, subTotal, coupon, isCouponApplied, clearCart } =
    useCartStore();
  const { user } = useUserStore();

  // Compute derived values for display
  const savings = subTotal - total; // Calculate savings from discounts/coupons
  const formattedSubtotal = subTotal.toFixed(2); // Format subtotal
  const formattedTotal = total.toFixed(2); // Format total price
  const formattedSavings = savings.toFixed(2); // Format savings

  // Function to handle Razorpay payment process
  const handlePayment = async () => {
    try {
      // Dynamically load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load Razorpay script");
        return;
      }

      // Call backend to create Razorpay order
      const response = await axios.post("/payments/create-order", {
        products: cart, // Pass cart details to backend
        couponCode: isCouponApplied ? coupon.code : "", // Include coupon code if applied
      });

      const { id: razorpayOrderId, amount } = response.data; // Extract Razorpay order ID and amount

      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Public key for Razorpay
        amount: amount * 100, // Razorpay expects amount in paise (multiply by 100)
        currency: "INR", // Set currency to Indian Rupees
        name: "Trendify-Ecommerce-App", // Business name
        order_id: razorpayOrderId, // Pass the order ID from backend
        handler: async (response) => {
          // Extract payment details returned by Razorpay
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          // Verify payment on the server
          try {
            const verifyResponse = await axios.post(
              "/payments/verify-payment",
              {
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
              }
            );

            clearCart(); // Clear the cart after successful payment

            toast.success(
              "Payment successful! Redirecting to order confirmation..."
            );
            // Redirect to order confirmation page
            window.location.href = `/order-success/${verifyResponse.data.orderId}`;
          } catch (error) {
            toast.error("Payment verification failed. Please try again later.");
            console.error("Error verifying payment:", error.response.data);
          }
        },
        prefill: {
          name: user?.name, // Pre-fill Razorpay form with user name
          email: user?.email, // Pre-fill Razorpay form with user email
          contact: "9876543210", // Placeholder for contact (replace with user's contact if available)
        },
        theme: {
          color: "#3399cc", // Customize Razorpay theme color
        },
        modal: {
          ondismiss: () => {
            // Handle payment cancellation
            toast.error("Payment was cancelled. You can try again.");
            console.log("Payment modal was closed or cancelled.");
          },
        },
      };

      // Open Razorpay payment modal
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      toast.error("Failed to initiate payment. Please try again.");
      console.error(
        "Error initiating Razorpay payment:",
        error.response?.data || error.message
      );
    }
  };

  // Render the order summary UI
  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }} // Initial animation state
      animate={{ opacity: 1, y: 0 }} // Final animation state
      transition={{ duration: 0.5 }} // Smooth animation duration
    >
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      {/* Display price breakdown */}
      <div className="space-y-4">
        <div className="space-y-2">
          {/* Display original price */}
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original price
            </dt>
            <dd className="text-base font-medium text-white">
              ₹{formattedSubtotal}
            </dd>
          </dl>

          {/* Display savings (if any) */}
          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                -₹{formattedSavings}
              </dd>
            </dl>
          )}

          {/* Display coupon details if applied */}
          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}

          {/* Display total price */}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              ₹{formattedTotal}
            </dd>
          </dl>
        </div>

        {/* Proceed to checkout button */}
        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>

        {/* Link to continue shopping */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} /> {/* Arrow icon */}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary; // Export component for use elsewhere
