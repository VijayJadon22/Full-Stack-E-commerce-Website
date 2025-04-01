import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subTotal: 0,
    
    getCartItems: async () => {
        try {
            const res = await axios.get("/cart");
            set({cart:res.data})
        } catch (error) {
            set({ cart: [] });
            toast.error(error.response.data.message || "An error occurred");
        }
    },
}))