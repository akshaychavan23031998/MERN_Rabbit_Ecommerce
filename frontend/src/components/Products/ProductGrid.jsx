import React from "react";
import { Link } from "react-router-dom";
import useCurrencyRate from "../../hooks/useCurrencyRate";
import { formatPriceWithPsychology } from "../../utils/priceUtils";

const ProductGrid = ({ products, loading, error }) => {
  const rate = useCurrencyRate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // if (!Array.isArray(products) || products.length === 0) {
  //   return <p>No products found.</p>;
  // }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 text-lg">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`} className="block">
          <div className="bg-white p-4 rounded-lg">
            <div className="w-full h-96 mb-4">
              <img
                className="w-full h-full object-cover rounded-lg"
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
              />
            </div>
            <h3 className="text-sm mb-2">{product.name}</h3>
            <p className="text-gray-500 font-medium tracking-tighter text-sm">
              ₹{" "}
              {formatPriceWithPsychology(product.price, rate).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
