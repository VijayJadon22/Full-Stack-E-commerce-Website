import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";
import { useUserStore } from "./useUserStore.js";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subTotal: 0,
    isCouponApplied: false,
    

    getCartItems: async () => {
        try {
            const res = await axios.get("/cart");
            set({ cart: res.data });
            get().calculateTotals();
        } catch (error) {
            console.error("Error fetching cart items:", error.message);
            set({ cart: [] });
        }
    },

    addToCart: async (product) => {
        try {
            await axios.post("/cart", { productId: product._id });
            toast.success("Product added to cart successfully");
            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);
                const newCart = existingItem
                    ? prevState.cart.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)) : [...prevState.cart, { ...product, quantity: 1 }];

                return { cart: newCart };
            });
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    removeFromCart: async (productId) => {
        await axios.delete("/cart", { data: { productId } });
        // const cartItems = get().cart.filter((item) => item._id !== productId);
        // set({cart:cartItems});
        set((prevState) => ({
            cart: prevState.cart.filter((item) => item._id !== productId)
        }));
        get().calculateTotals();

    },

    clearCart: async () => {
        try {
            await axios.delete("/cart/clear");
            set({ cart: [], coupon: null, total: 0, subTotal: 0, isCouponApplied: false });
        } catch (error) {
            console.error("Error clearing cart:", error);
            toast.error("Failed to clear cart. Please try again.");
        }

    },

    updateQuantity: async (productId, quantity) => {
        if (quantity === 0) {
            get().removeFromCart(productId);
            return;
        }
        await axios.put(`/cart/${productId}`, { quantity });
        set((prevState) => ({
            cart: prevState.cart.map((item) => item._id === productId ? { ...item, quantity: quantity } : item)
        }));
        get().calculateTotals();
    },

    getMyCoupon: async () => {
        try {
            const response = await axios.get("/coupons");
            set({ coupon: response.data });
        } catch (error) {
            console.error("Error fetching coupon:", error);
        }
    },

    applyCoupon: async (code) => {
        try {
            const response = await axios.post("/coupons/validate", { code });
            set({ coupon: response.data, isCouponApplied: true });
            get().calculateTotals();
            toast.success("Coupon applied successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply coupon. Please try again.");
        }
    },

    removeCoupon: () => { 
        set({ coupon: null, isCouponApplied: false });
        get().calculateTotals();
        toast.success("Coupon removed");
    },
    
    calculateTotals: () => {
        const { cart, coupon } = get();
        const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let total = subTotal;

        if (coupon) {
            const discount = subTotal * (coupon.discountPercentage / 100);
            total = subTotal - discount;
        }
        set({ subTotal, total });
    }
}))