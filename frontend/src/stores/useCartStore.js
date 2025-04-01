import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";
import { updateQuantity } from "../../../backend/controllers/cart.controller.js";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subTotal: 0,

    getCartItems: async () => {
        try {
            const res = await axios.get("/cart");
            set({ cart: res.data });
            get().calculateTotals();
        } catch (error) {
            set({ cart: [] });
            // toast.error(error.response.data.message || "An error occurred");
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

    updateQuantity: async () => { },

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