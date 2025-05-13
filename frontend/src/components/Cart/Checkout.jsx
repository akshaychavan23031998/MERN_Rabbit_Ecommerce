import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";

const cart = {
  products: [
    {
      name: "Stylish Jacket",
      size: "M",
      color: "Black",
      price: 1200,
      image: "https://picsum.photos/150?random=1",
    },
    {
      name: "Shooes",
      size: "M",
      color: "Black",
      price: 1800,
      image: "https://picsum.photos/150?random=2",
    },
  ],
  totalPrice: 3000,
};

const Checkout = () => {
  const navigate = useNavigate();
  const [checkoutId, setCheckoutId] = useState();
  const [shippingAddress, setShippingAddress] = useState({
    firstname: "",
    lastname: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [exchangeRate, setExchangeRate] = useState(83); // Default fallback
  const totalInINR = cart.totalPrice;

  useEffect(() => {
    // Fetch latest INR to USD rate
    fetch("https://api.exchangerate.host/latest?base=INR&symbols=USD")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates && data.rates.USD) {
          setExchangeRate(data.rates.USD);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch exchange rate, using fallback", err);
      });
  }, []);

  const amountInUSD = (totalInINR / exchangeRate).toFixed(2); // Multiply because base=INR, it gives the value for 1 rs.

  const handleCreateCheckout = (e) => {
    e.preventDefault();
    setCheckoutId(123);
  };

  const handlePaymentSuccess = (details) => {
    console.log("Payment Success", details);
    navigate("/order-confirmation");
  };

  const formatCurrencyWithSpace = (value, locale, currency) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol", // optional, for compact symbol
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace(/(\D)(\d)/, "$1 $2"); // 👈 adds space between symbol and number
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value="akshay@gmail.com"
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                required
                value={shippingAddress.firstname}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstname: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                required
                value={shippingAddress.lastname}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastname: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              className="w-full p-2 border rounded"
              required
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                required
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                required
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-4">
              <label className="block text-gray-700">Country</label>
              <input
                className="w-full p-2 border rounded"
                required
                type="text"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Phone No.</label>
              <input
                className="w-full p-2 border rounded"
                required
                type="text"
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    phone: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mt-6">
            {!checkoutId ? (
              <button
                className="w-full bg-black text-white py-3 rounded"
                type="submit"
              >
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay With Paypal</h3>
                {/* Paypal Component */}
                <PayPalButton
                  amount={amountInUSD}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => {
                    console.error("PayPal error:", err);
                    alert("Something went wrong. Please try again.");
                  }}
                />
              </div>
            )}
          </div>
        </form>
      </div>
      {/* Right Side */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4"
                />
                <div>
                  <h3 className="text-md">{product.name}</h3>
                  <p className="text-gray-500">Size: {product.size}</p>
                  <p className="text-gray-500">Color: {product.color}</p>
                </div>
              </div>
              <p className="text-xl font-bold">
                {formatCurrencyWithSpace(product.price, "en-IN", "INR", 0)}{" "}
                <span className="text-sm text-gray-500 font-normal ml-1">
                  ≈{" "}
                  {formatCurrencyWithSpace(
                    (product.price / exchangeRate).toFixed(2),
                    "en-US",
                    "USD"
                  )}
                </span>
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p className="text-xl font-bold">
            {formatCurrencyWithSpace(cart.totalPrice, "en-IN", "INR", 0)}{" "}
            <span className="text-sm text-gray-500 font-normal ml-1">
              ≈ {formatCurrencyWithSpace(amountInUSD, "en-US", "USD")}
            </span>
          </p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p className="text-xl font-bold">
            {formatCurrencyWithSpace(cart.totalPrice, "en-IN", "INR", 0)}{" "}
            <span className="text-sm text-gray-500 font-normal ml-1">
              ≈ {formatCurrencyWithSpace(amountInUSD, "en-US", "USD")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
