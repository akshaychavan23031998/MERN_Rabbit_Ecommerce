import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";
import useCurrencyRate from "../../hooks/useCurrencyRate";
import { formatPriceWithPsychology } from "../../utils/priceUtils";

const CardContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();
  const rate = useCurrencyRate();

  // const displayINR = (item) => {
  //   // prefer discounted price if present on the cart item; fallback to price
  //   const base = Number(item.discountPrice ?? item.price);
  //   return formatPriceWithPsychology(base, rate).toLocaleString("en-IN");
  // };

  const displayINR = (item) => {
    if (item.priceINR != null) return item.priceINR.toLocaleString("en-IN");
    const base = Number(item.discountPrice ?? item.price); // USD
    return formatPriceWithPsychology(base, rate).toLocaleString("en-IN");
  };

  // Handle adding or substracting the cart
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      console.log("Dispatching quantity update:");
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    // dispatch(removeFromCart({ productId, guestId, userId, color }));
    dispatch(removeFromCart({ productId, guestId, userId, color, size }));
  };

  return (
    <div>
      {cart.products.map((product, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row justify-between gap-4 py-4 border-b"
        >
          {/* Left: Image + Info */}
          <div className="flex gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-28 object-cover rounded"
            />
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-base font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">
                  size: {product.size} | color: {product.color}
                </p>
              </div>

              {/* Show on Mobile: Price + Delete */}
              <div className="flex sm:hidden items-center justify-between mt-2">
                <p className="text-sm font-medium">
                  <p className="text-sm font-medium">₹ {displayINR(product)}</p>
                </p>
                <button
                  onClick={() =>
                    handleRemoveFromCart(
                      product.productId,
                      product.size,
                      product.color
                    )
                  }
                >
                  <RiDeleteBin3Line className="h-5 w-5 text-red-700" />
                </button>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  disabled={product.quantity === 1}
                  className="w-8 h-8 border rounded text-lg font-bold flex items-center justify-center disabled:opacity-50"
                >
                  −
                </button>
                <span className="w-8 text-center text-base font-medium">
                  {product.quantity}
                </span>
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="w-8 h-8 border rounded text-lg font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Price + Delete */}
          <div className="hidden sm:flex flex-col justify-between items-end">
            <p className="text-sm sm:text-base md:text-lg font-semibold">
              ₹ {displayINR(product)}
            </p>

            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color
                )
              }
            >
              <RiDeleteBin3Line className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 mt-2 text-red-700" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardContents;
