import { Link, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";

const SuccessPage = () => {
  const { orderId } = useParams(); // Retrieve the order ID from the URL

  return (
    <div className=" p-4 flex flex-col items-center justify-center h-64 bg-gray-800  text-white">
      <CheckCircle size={30} className="mb-4" />
      <h1 className="text-4xl font-bold text-emerald-400">Thank You!</h1>
      <p className="text-lg mt-2">Your order has been placed successfully.</p>
      <p className="text-sm mt-1">Order ID: {orderId}</p>
      <Link
        to={"/"}
        className="mt-4 bg-emerald-600 px-6 py-2 rounded-lg text-white hover:bg-emerald-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default SuccessPage;
