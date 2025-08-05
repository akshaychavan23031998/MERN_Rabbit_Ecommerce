import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);
  const [confettiVisible, setConfettiVisible] = useState(true);
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  const [width, height] = useWindowSize();

  //clear the cart when the order is confirmed
  // useEffect(() => {
  //   const timer = setTimeout(() => setShowConfetti(false), 4000);
  //   if (checkout && checkout._id) {
  //     dispatch(clearCart());
  //     localStorage.removeItem("cart");
  //   } else {
  //     navigate("/my-orders");
  //   }
  //   return () => clearTimeout(timer);
  // }, [checkout, dispatch, navigate]);

  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");

      // Fade out after 7 seconds
      const fadeTimeout = setTimeout(() => {
        const fadeInterval = setInterval(() => {
          setConfettiOpacity((prev) => {
            if (prev <= 0.05) {
              clearInterval(fadeInterval);
              setConfettiVisible(false);
              return 0;
            }
            return prev - 0.05;
          });
        }, 50); // fades in 1s
      }, 7000); // 🕒 wait 7s before starting fade

      return () => clearTimeout(fadeTimeout);
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // 10 days from order date
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* 🎊 Confetti blast! */}
      {/* 🎊 Confetti blast with smooth fade */}
      {confettiVisible && (
        <div
          style={{
            opacity: confettiOpacity,
            transition: "opacity 0.5s linear",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <Confetti width={width} height={height} />
        </div>
      )}

      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You For Your Order!
      </h1>

      {checkout && (
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between mb-20">
            {/* Order Id and date */}
            <div>
              <h2 className="text-xl font-semibold">
                Order ID: {checkout._id}
              </h2>
              <p className="text-gray-500">
                Order date: {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Estimated Delivery*/}
            <div>
              <p>
                Estimated Delivery:{" "}
                {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>
          {/* Order Items */}
          <div className="mb-20">
            {checkout?.checkOutItems?.map((item) => (
              <div className="flex items-center mb-4" key={item.productId}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color} | {item.size}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md">${item.price}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Payment and Delivery Info */}
          <div className="grid grid-cols-2 gap-8">
            {/* Payment Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment</h4>
              <p className="text-gray-600">Razorpay</p>
            </div>
            {/* Delivery Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Delivery</h4>
              <p className="text-gray-600">
                {checkout.shippingAddress.address}
              </p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
