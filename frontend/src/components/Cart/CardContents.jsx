import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

const CardContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

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
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded"
            />
            <div>
              <h3>{product.name}</h3>
              <p className="text-sm text-gray-500">
                size: {product.size} | color: {product.color}
              </p>

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
                  className="w-10 h-10 border rounded text-xl font-bold flex items-center justify-center disabled:opacity-50"
                >
                  −
                </button>

                <span className="w-10 text-center text-lg font-medium">
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
                  className="w-10 h-10 border rounded text-xl font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p>
              {"\u20B9"} {product.price.toLocaleString()}
            </p>
            <button
              onClick={() => {
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color
                );
              }}
            >
              <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-700" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardContents;
