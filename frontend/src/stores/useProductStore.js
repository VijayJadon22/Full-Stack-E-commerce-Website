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
                loading: false,
            }));
        } catch (error) {
            toast.error(error.response.data.error);
            set({ loading: false });
        }
    },

    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/products");
            set({ products: response.data.products, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch products", loading: false });
            toast.error(error.response.data.error || "Failed to fetch products");
        }
    },

    fetchProductsByCategory: async (category) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/products/category/${category}`);
            set({ products: response.data.products, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch products", loading: false });
            toast.error(error.response.data.error || "Failed to fetch products");
        }
    },

    deleteProduct: async (id) => {
        set({ loading: true });
        try {
            const res = await axios.delete(`/products/${id}`);
            set((prevState) => ({
                products: prevState.products.filter((product) => product._id !== id),
                loading: false,
            }));
            toast.success("Product deleted successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.res.data.error || "Failed to delete product");
        }
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
    },

    fetchFeaturedProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/products/featured");
            set({ products: response.data, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch products", loading: false });
            console.log("Error fetching featured products:", error);
        }
    },

}))