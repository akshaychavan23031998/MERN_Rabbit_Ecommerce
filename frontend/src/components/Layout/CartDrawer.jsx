// import React, { useState } from "react";
// import { IoMdClose } from "react-icons/io";
// import CardContents from "../Cart/CardContents";
// import Checkout from "../Cart/Checkout";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
//   const navigate = useNavigate();
//   const { user, guestId } = useSelector((state) => state.auth);
//   const { cart } = useSelector((state) => state.cart);
//   const userId = user ? user._id : null;
//   const handleCheckout = () => {
//     toggleCartDrawer();
//     if (!user) {
//       navigate("/login?redirect=checkout");
//     } else {
//       navigate("/checkout");
//     }
//   };

//   return (
//     <div
//       className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem]
//  h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
//    drawerOpen ? "translate-x-0" : "translate-x-full"
//  }`}
//     >
//       {/*Close Button*/}
//       <div className="flex justify-end p-4">
//         <button onClick={toggleCartDrawer}>
//           <IoMdClose className="h-6 w-6 text-gray-700" />
//         </button>
//       </div>

//       {/*card content with scrolleable area*/}
//       <div className="flex-grow p-4 overflow-y-auto">
//         <h2 className="text-xl font-semibold mb-4">Your Card</h2>
//         {cart && cart?.products?.length > 0 ? (
//           <CardContents cart={cart} userId={userId} guestId={guestId} />
//         ) : (
//           <p> Your cart is empty</p>
//         )}
//         {/*component for card content*/}
//       </div>

//       {/*checkout button fixed at bottom*/}
//       <div className="p-4 bg-white sticky bottom-0">
//         {cart && cart?.products?.length > 0 && (
//           <>
//             <button
//               onClick={handleCheckout}
//               className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
//             >
//               Checkout
//             </button>
//             <p className="text-xs tracking-tighter text-gray-500 mt-2 text-center">
//               Shipping, taxes & discount Codes calculated at checkout.
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartDrawer;

import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import CardContents from "../Cart/CardContents";
import Checkout from "../Cart/Checkout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  // const cart = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mount and trigger animation
  useEffect(() => {
    if (drawerOpen) {
      setIsMounted(true);
      document.body.classList.add("no-scroll");

      // Wait a frame then animate in
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      // Start fade-out
      setIsVisible(false);

      // After animation, unmount
      setTimeout(() => {
        setIsMounted(false);
        document.body.classList.remove("no-scroll");
      }, 300); // match transition duration
    }
  }, [drawerOpen]);

  // ESC key close
  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === "Escape" && drawerOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, [drawerOpen]); // important to watch drawerOpen state

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      toggleCartDrawer();
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target)) {
      handleClose();
    }
  };

  const handleCheckout = () => {
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  const processedProducts = Object.values(cart.products || {});

  return (
    <div
      className={`fixed inset-0 z-40 flex justify-end transition-opacity duration-300 ${
        isMounted ? "pointer-events-auto" : "pointer-events-none"
      } ${
        isVisible ? "opacity-100 bg-black/30 backdrop-blur-sm" : "opacity-0"
      }`}
      onClick={handleOverlayClick}
    >
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={`w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={handleClose}>
            <IoMdClose className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-grow p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          {cart && processedProducts.length > 0 ? (
            <CardContents
              cart={{ ...cart, products: processedProducts }}
              userId={userId}
              guestId={guestId}
            />
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>

        {/* Checkout */}
        <div className="p-4 bg-white sticky bottom-0">
          {cart && processedProducts.length > 0 && (
            <>
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Checkout
              </button>
              <p className="text-xs tracking-tighter text-gray-500 mt-2 text-center">
                Shipping, taxes & discount codes calculated at checkout.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
