"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const ButtonCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.post("/api/billing/create-checkout", {
        successUrl: window.location.href + "/success",
        cancelUrl: window.location.href,
      });

      const checkoutUrl = response.data.url;

      window.location.href = checkoutUrl;
    } catch (e) {
      const errorMessage =
        e.response?.data?.error || e.message || "Something went wrong";

      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <button className="btn btn-primary" onClick={() => handleSubscribe()}>
      {isLoading && (
        <span className="loading loading-spinner loading-xs"></span>
      )}
      Checkout
    </button>
  );
};

export default ButtonCheckout;
