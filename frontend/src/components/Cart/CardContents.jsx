import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";

const CardContents = () => {
  const cardProducts = [
    {
      productId: 1,
      name: "T-shirt",
      size: "M",
      color: "Red",
      price: 1400,
      quantity: "1",
      image: "https://picsum.photos/200?random=1",
    },
    {
      productId: 2,
      name: "Jeans",
      size: "M",
      color: "Black",
      price: 4000,
      quantity: "1",
      image: "https://picsum.photos/200?random=2",
    },
  ];

  return (
    <div>
      {cardProducts.map((product, index) => (
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

              <div className="flex items-center mt-2">
                <button className="border rounded px-2 py-1 text-xl font-medium">
                  -
                </button>
                <span className="mx-4">{product.quantity}</span>
                <button className="border rounded px-2 py-1 text-xl font-medium">
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p>{'\u20B9'} {product.price.toLocaleString()}</p>
            <button>
                <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-700"/>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardContents;
