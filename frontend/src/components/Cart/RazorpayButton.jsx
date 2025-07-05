// RazorpayButton.jsx

import React from "react";

const RazorpayButton = ({ amountInINR, shippingAddress, onSuccess, onError, orderId }) => {
  const loadRazorpay = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amountInINR * 100, // in paise
      currency: "INR",
      name: "Your Store Name",
      description: "Test Transaction",
      order_id: orderId, // ✅ This should come from your backend
      prefill: {
        name: `${shippingAddress.firstname} ${shippingAddress.lastname}`,
        email: "customer@example.com",
        contact: shippingAddress.phone,
      },
      notes: {
        address: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.country}`,
      },
      theme: {
        color: "#000",
      },
      handler: function (response) {
        console.log("Payment Success:", response);
        onSuccess(response);
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", function (response) {
      console.error("Payment Failed:", response);
      onError(response.error);
    });

    razorpay.open();
  };

  return (
    <button
      className="w-full bg-black text-white py-3 rounded"
      onClick={loadRazorpay}
    >
      Pay with Razorpay
    </button>
  );
};

export default RazorpayButton;
