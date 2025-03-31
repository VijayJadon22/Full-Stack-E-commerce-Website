import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios.js";

export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,


    setProducts: (products) => set({ products }),

    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/products", productData);
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false
            }))
        } catch (error) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }

    },

    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/products");
            set({ products: res.data.products, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch products", loading: false });
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    deleteProduct: async (id) => {

    },
    toggleFeaturedProduct: async (id) => {
        set({ loading: true });
        try {
            const res = await axios.patch(`/products/${id}`);
            set((prevState) => ({
                products: prevState.products.map((product) =>
                    product._id === id ? { ...product, isFeatured: res.data.isFeatured } : product
                ),
                loading: false
            }))
        } catch (error) {
            set({ loading: false });
            toast.error(error.res.data.error || "Failed to update product");
        }
    }
}))