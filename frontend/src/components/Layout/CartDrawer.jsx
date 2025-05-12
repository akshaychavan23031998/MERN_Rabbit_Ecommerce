import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import CardContents from "../Cart/CardContents";
import Checkout from "../Cart/Checkout";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {

  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate("/checkout");
  }

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem]
 h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
   drawerOpen ? "translate-x-0" : "translate-x-full"
 }`}
    >
      {/*Close Button*/}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/*card content with scrolleable area*/}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Card</h2>
        {/*component for card content*/}
        <CardContents/>
      </div>

       {/*checkout button fixed at bottom*/}
       <div className="p-4 bg-white sticky bottom-0">
            <button onClick={handleCheckout} className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                Checkout
            </button>
            <p className="text-xs tracking-tighter text-gray-500 mt-2 text-center">Shipping, taxes & discount Codes calculated at checkout.</p>
       </div>
    </div>
  );
};

export default CartDrawer;
