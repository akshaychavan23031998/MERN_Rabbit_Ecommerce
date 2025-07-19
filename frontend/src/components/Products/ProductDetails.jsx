import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";
// 1. First, import the hook at the top:
import useCurrencyRate from "../../hooks/useCurrencyRate";

// const selectedProduct = {
//   name: "Stylish Jacket",
//   price: "1200",
//   originalPrice: "1800",
//   description: "This is a stylish Jacket perfect for any occasion",
//   brand: "FashionBrand",
//   material: "Leather",
//   sizes: ["S", "M", "L", "XL"],
//   colors: ["Red", "Black"],
//   images: [
//     {
//       url: "https://picsum.photos/500/500?random=1",
//       altText: "Stylish Jacket 1",
//     },
//     {
//       url: "https://picsum.photos/500/500?random=2",
//       altText: "Stylish Jacket 2",
//     },
//   ],
// };

// const similarProducts = [
//   {
//     _id: 1,
//     name: "Product 1",
//     price: 1200,
//     images: [{url: "https://picsum.photos/500/500?random=6"}]
//   },
//   {
//     _id: 2,
//     name: "Product 2",
//     price: 1200,
//     images: [{url: "https://picsum.photos/500/500?random=7"}]
//   },
//   {
//     _id: 3,
//     name: "Product 3",
//     price: 1200,
//     images: [{url: "https://picsum.photos/500/500?random=8"}]
//   },
//   {
//     _id: 4,
//     name: "Product 4",
//     price: 1200,
//     images: [{url: "https://picsum.photos/500/500?random=9"}]
//   }
// ]

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );

  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  // const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // const { loading } = useSelector((state) => state.cart);

  const productFetchId = productId || id;
  const rate = useCurrencyRate();

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  // useEffect(() => {
  //   if (selectedProduct?.images?.length > 0) {
  //     setMainImage(selectedProduct.images[0].url);
  //   }
  // }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.images?.length > 0) {
        setMainImage(selectedProduct.images[0].url);
      }
      setSelectedColor(""); // Reset on product change
      setSelectedSize(""); // Optional: reset size too
      setQuantity(1); // Optional: reset quantity
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select Size and Color before adding to cart.", {
        duration: 1000,
      });
      return;
    }

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Product added to the cart!", {
          duration: 1000,
        });
      })
      .catch(() => {
        toast.error("Failed to add product to cart.");
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* left Thumbnail */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images.map((image, index) => (
                <img
                  className={`w-20 h-20 object-cover rounded-lg  cursor-pointer border ${
                    mainImage === image.url ? "border-black" : "border-gray-300"
                  }`}
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>
            {/* Main Image */}
            <div className="md:w-1/2">
              <div className="mb-4">
                <img
                  src={mainImage}
                  alt="Main Product"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* Mobile Thumbnail */}
            <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
              {selectedProduct.images.map((image, index) => (
                <img
                  // className="w-20 h-20 object-cover rounded-lg  cursor-pointer border"
                  className={`w-20 h-20 object-cover rounded-lg  cursor-pointer border ${
                    mainImage === image.url ? "border-black" : "border-gray-300"
                  }`}
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>
            {/* Right Side */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selectedProduct.name}
              </h1>

              <div className="mb-4">
                {selectedProduct.discountPrice ? (
                  (() => {
                    const priceUSD = Number(selectedProduct.price);
                    const discountUSD = Number(selectedProduct.discountPrice);
                    const priceINR = Math.round(priceUSD * rate);
                    const discountINR = Math.round(discountUSD * rate);
                    const discountPercent = Math.round(
                      ((priceUSD - discountUSD) / priceUSD) * 100
                    );

                    // FOMO pricing logic
                    const fomoPrice = (amount) => {
                      if (amount > 999) return amount - (amount % 100) + 99; // 1048 → 1099
                      if (amount > 100) return amount - (amount % 10) + 9; // 248 → 249
                      return amount; // small amounts don't round
                    };

                    const fomoPriceINR = fomoPrice(priceINR);
                    const fomoDiscountINR = fomoPrice(discountINR);

                    let badgeClass = "bg-green-100 text-green-800";
                    if (discountPercent < 10) {
                      badgeClass = "bg-yellow-100 text-yellow-800";
                    } else if (discountPercent > 40) {
                      badgeClass = "bg-red-100 text-red-800";
                    }

                    return (
                      <div className="flex items-center gap-4 mb-4">
                        <p className="text-lg text-gray-600 line-through">
                          ₹ {fomoPriceINR.toLocaleString("en-IN")}
                        </p>
                        <p className="text-xl text-red-600 font-semibold">
                          ₹ {fomoDiscountINR.toLocaleString("en-IN")}
                        </p>
                        <span
                          className={`text-sm font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${badgeClass}`}
                        >
                          🔥 SAVE {discountPercent}%{" "}
                          <span className="text-xs">Limited Offer</span>
                        </span>
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-xl text-gray-900 font-semibold mb-2">
                    ₹{" "}
                    {(() => {
                      const priceINR = Math.round(
                        Number(selectedProduct.price) * rate
                      );
                      const fomo =
                        priceINR > 100
                          ? priceINR - (priceINR % 10) + 9
                          : priceINR;
                      return fomo.toLocaleString("en-IN");
                    })()}
                  </p>
                )}
              </div>

              <p className="text-gray-600 mb-4">
                {selectedProduct?.description || "No description available."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Color */}
                <div>
                  <p className="text-gray-700 font-medium mb-2">Color:</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {selectedProduct.colors.map((color, index) => {
                      // Format the color string
                      const safeColor = color.toLowerCase().replace(/\s/g, "");
                      const isSafeCSSColor = CSS.supports("color", safeColor);

                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-1"
                        >
                          <button
                            onClick={() => setSelectedColor(color)}
                            className={`w-8 h-8 rounded-full border-2 cursor-pointer transition ${
                              selectedColor === color
                                ? "ring-2 ring-black border-black"
                                : "border-gray-300"
                            }`}
                            style={{
                              backgroundColor: isSafeCSSColor
                                ? safeColor
                                : "#e5e7eb",
                              backgroundImage: isSafeCSSColor
                                ? "none"
                                : "url('https://img.icons8.com/ios/50/pattern.png')",
                              backgroundSize: "cover",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                              color: "transparent",
                            }}
                            title={color}
                          />
                          {!isSafeCSSColor && (
                            <span className="text-xs text-gray-600">
                              {color}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <p className="text-gray-700 font-medium">Sizes:</p>
                  <div className="flex gap-2 mt-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded border cursor-pointer ${
                          selectedSize === size ? "bg-black text-white" : ""
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <p className="text-gray-700 font-medium">Quantity:</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      onClick={() => handleQuantityChange("minus")}
                      className="px-2 py-2 bg-gray-200 text-lg rounded cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-lg min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange("plus")}
                      className="px-2 py-2 bg-gray-200 text-lg rounded cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Characteristics */}
                <div>
                  <p className="text-gray-700 font-medium mb-2">
                    Characteristics:
                  </p>
                  <table className="w-full text-left text-sm text-gray-600">
                    <tbody>
                      <tr>
                        <td className="py-1">Brand</td>
                        <td className="py-1">{selectedProduct.brand}</td>
                      </tr>
                      <tr>
                        <td className="py-1">Material</td>
                        <td className="py-1">{selectedProduct.material}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add to Cart Button - full width below grid */}
              <div className="mt-10">
                <button
                  onClick={handleAddToCart}
                  disabled={loading}
                  className={`bg-black text-white py-2 px-6 rounded w-full cursor-pointer ${
                    loading
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-gray-900"
                  }`}
                >
                  {loading ? "Adding..." : "Add To Cart"}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-4">
              You May Also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
