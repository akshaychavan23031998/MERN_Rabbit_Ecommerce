// // src/components/Admin/AddProductPage.jsx
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { createProduct } from "../../redux/slices/adminProductSlice";
// import axios from "axios";

// const AddProductPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // AddProductPage.jsx
//   const [productData, setProductData] = useState({
//     name: "",
//     description: "",
//     price: 0,
//     discountPrice: 0,
//     countInStock: 0,
//     sku: "",
//     category: "Top Wear", // ✅ default required
//     brand: "",
//     sizes: [], // ✅ must not be empty when submit
//     colors: [], // ✅ must not be empty when submit
//     collections: "all", // ✅ default required
//     material: "",
//     gender: "Unisex", // ✅ matches enum ("Men"|"Women"|"Unisex")
//     images: [], // you’re adding via uploader
//   });

//   const [uploading, setUploading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProductData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       setUploading(true);
//       const { data } = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       setProductData((prev) => ({
//         ...prev,
//         images: [...prev.images, { url: data.imageUrl, altText: "" }],
//       }));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const errors = [];
//     if (!productData.name.trim()) errors.push("name");
//     if (!productData.description.trim()) errors.push("description");
//     if (!productData.sku.trim()) errors.push("sku");
//     if (!productData.category) errors.push("category");
//     if (!productData.collections) errors.push("collections");
//     if (productData.sizes.length === 0) errors.push("sizes (at least one)");
//     if (productData.colors.length === 0) errors.push("colors (at least one)");
//     if (typeof productData.price !== "number" || isNaN(productData.price))
//       errors.push("price");
//     if (
//       typeof productData.countInStock !== "number" ||
//       isNaN(productData.countInStock)
//     )
//       errors.push("countInStock");

//     if (errors.length) {
//       alert("Please fill:\n• " + errors.join("\n• "));
//       return;
//     }

//     const payload = {
//       ...productData,
//       price: Number(productData.price) || 0,
//       discountPrice: Number(productData.discountPrice) || 0,
//       countInStock: Number(productData.countInStock) || 0,
//     };

//     dispatch(createProduct(payload))
//       .unwrap()
//       .then(() => navigate("/admin/products"));
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
//       <h2 className="text-3xl font-bold mb-6">Add Product</h2>

//       <form onSubmit={handleSubmit}>
//         {/* Name */}
//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Product Name</label>
//           <input
//             type="text"
//             name="name"
//             value={productData.name}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md p-2"
//             required
//           />
//         </div>

//         {/* Description */}
//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Description</label>
//           <textarea
//             name="description"
//             value={productData.description}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md p-2"
//             rows={4}
//             required
//           />
//         </div>

//         {/* Price */}
//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Price</label>
//           <input
//             type="number"
//             name="price"
//             value={productData.price}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md p-2"
//           />
//         </div>

//         {/* Discount Price (optional) */}
//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Discount Price</label>
//           <input
//             type="number"
//             name="discountPrice"
//             value={productData.discountPrice}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md p-2"
//           />
//         </div>

//         {/* Count In Stock */}
//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Count In Stock</label>
//           <input
//             type="number"
//             name="countInStock"
//             value={productData.countInStock}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md p-2"
//           />
//         </div>

//         {/* SKU */}
//         <div className="mb-6">
//           <label className="block font-semibold mb-2">SKU</label>
//           <input
//             type="text"
//             name="sku"
//             value={productData.sku}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-md p-2"
//           />
//         </div>

//         {/* Category (required) */}
//         <label className="block font-semibold mb-2">Category</label>
//         <select
//           name="category"
//           value={productData.category}
//           onChange={handleChange}
//           required
//           className="w-full border rounded p-2"
//         >
//           <option value="Top Wear">Top Wear</option>
//           <option value="Bottom Wear">Bottom Wear</option>
//         </select>

//         {/* Collection (required) */}
//         <label className="block font-semibold mb-2 mt-6">Collection</label>
//         <select
//           name="collections"
//           value={productData.collections}
//           onChange={handleChange}
//           required
//           className="w-full border rounded p-2"
//         >
//           <option value="all">all</option>
//           {/* add others if you use them */}
//         </select>

//         {/* Gender (optional but must be valid if sent) */}
//         <label className="block font-semibold mb-2 mt-6">Gender</label>
//         <select
//           name="gender"
//           value={productData.gender}
//           onChange={handleChange}
//           className="w-full border rounded p-2"
//         >
//           <option value="Men">Men</option>
//           <option value="Women">Women</option>
//           <option value="Unisex">Unisex</option>
//         </select>

//         {/* Sizes */}
//         <div className="mt-6 mb-6">
//           <label className="block font-semibold mb-2">
//             Sizes (comma-separated)
//           </label>
//           <input
//             type="text"
//             name="sizes"
//             value={productData.sizes.join(", ")}
//             onChange={(e) =>
//               setProductData((p) => ({
//                 ...p,
//                 sizes: e.target.value
//                   .split(",")
//                   .map((s) => s.trim())
//                   .filter(Boolean),
//               }))
//             }
//             className="w-full border border-gray-300 rounded-md p-2"
//           />
//         </div>

//         {/* Colors */}
//         <div className="mb-6">
//           <label className="block font-semibold mb-2">
//             Colors (comma-separated)
//           </label>
//           <input
//             type="text"
//             name="colors"
//             value={productData.colors.join(", ")}
//             onChange={(e) =>
//               setProductData((p) => ({
//                 ...p,
//                 colors: e.target.value
//                   .split(",")
//                   .map((c) => c.trim())
//                   .filter(Boolean),
//               }))
//             }
//             className="w-full border border-gray-300 rounded-md p-2"
//           />
//         </div>

//         {/* Images */}
//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Upload Image</label>
//           <label
//             htmlFor="imageUpload"
//             className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
//           >
//             Choose File
//           </label>
//           <input
//             id="imageUpload"
//             type="file"
//             onChange={handleImageUpload}
//             className="hidden"
//           />
//           {uploading && <p>Uploading Image...</p>}

//           <div className="flex gap-4 mt-4">
//             {productData.images.map((image, i) => (
//               <img
//                 key={i}
//                 src={image.url}
//                 alt={image.altText || "Product Image"}
//                 className="w-20 h-20 object-cover rounded-md shadow-md"
//               />
//             ))}
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
//         >
//           Create Product
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddProductPage;
// src/components/Admin/AddProductPage.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createProduct } from "../../redux/slices/adminProductSlice";

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Keep number inputs as empty string until the user types,
   * so required/validation behave naturally in the UI.
   */
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",            // <- string until submit
    discountPrice: "",    // <- optional
    countInStock: "",     // <- string until submit
    sku: "",
    category: "Top Wear", // required
    brand: "",
    sizes: [],            // required (at least one)
    colors: [],           // required (at least one)
    collections: "all",   // required
    material: "",
    gender: "Unisex",     // enum: "Men" | "Women" | "Unisex"
    images: [],           // optional, each { url, altText }
  });

  // simple per-field error display (front-end validation)
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  /**
   * Make number inputs actually store numbers,
   * otherwise typeof will be "string" and your checks will fail.
   */
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""     // allow empty while typing
            ? ""
            : Number(value)  // store as number
          : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }],
      }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /**
   * Front-end validation that mirrors your Mongoose schema.
   * Returns { valid: boolean, errs: Record<string,string> }
   */
  const validate = () => {
    const errs = {};

    // required strings
    if (!productData.name.trim()) errs.name = "Name is required";
    if (!productData.description.trim())
      errs.description = "Description is required";
    if (!productData.sku.trim()) errs.sku = "SKU is required";
    if (!productData.category) errs.category = "Category is required";
    if (!productData.collections) errs.collections = "Collection is required";

    // arrays required
    if (!productData.sizes.length) errs.sizes = "Add at least one size";
    if (!productData.colors.length) errs.colors = "Add at least one color";

    // numbers required
    const priceNum = Number(productData.price);
    const stockNum = Number(productData.countInStock);

    if (!Number.isFinite(priceNum)) errs.price = "Price is required";
    if (!Number.isFinite(stockNum)) errs.countInStock = "Count In Stock is required";
    if (Number.isFinite(priceNum) && priceNum < 0) errs.price = "Price cannot be negative";
    if (Number.isFinite(stockNum) && stockNum < 0)
      errs.countInStock = "Count In Stock cannot be negative";

    return { valid: Object.keys(errs).length === 0, errs };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { valid, errs } = validate();
    if (!valid) {
      setErrors(errs);
      // Optional toast/alert:
      alert(
        "Please fix the following:\n• " +
          Object.values(errs).join("\n• ")
      );
      return;
    }

    // build payload with correct numeric types; drop blank optional fields
    const payload = {
      ...productData,
      price: Number(productData.price),
      countInStock: Number(productData.countInStock),
      // only send discountPrice if user provided something
      ...(productData.discountPrice !== "" && {
        discountPrice: Number(productData.discountPrice),
      }),
    };

    dispatch(createProduct(payload))
      .unwrap()
      .then(() => navigate("/admin/products"))
      .catch((err) => {
        // Backend validation / duplicate SKU etc.
        if (err?.fields) {
          setErrors(err.fields);
          alert(
            "Server validation failed:\n• " +
              Object.values(err.fields).join("\n• ")
          );
        } else {
          alert(err?.message || "Failed to create product");
        }
      });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Add Product</h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
          {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Discount Price (optional) */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Discount Price</label>
          <input
            type="number"
            name="discountPrice"
            min="0"
            step="0.01"
            value={productData.discountPrice}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Optional"
          />
        </div>

        {/* Count In Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Count In Stock</label>
          <input
            type="number"
            name="countInStock"
            min="0"
            step="1"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
          {errors.countInStock && (
            <p className="text-red-600 text-sm mt-1">{errors.countInStock}</p>
          )}
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
          {errors.sku && <p className="text-red-600 text-sm mt-1">{errors.sku}</p>}
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Category</label>
          <select
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="Top Wear">Top Wear</option>
            <option value="Bottom Wear">Bottom Wear</option>
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Collection */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Collection</label>
          <select
            name="collections"
            value={productData.collections}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="all">all</option>
          </select>
          {errors.collections && (
            <p className="text-red-600 text-sm mt-1">{errors.collections}</p>
          )}
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Gender</label>
          <select
            name="gender"
            value={productData.gender}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(", ")}
            onChange={(e) =>
              setProductData((p) => ({
                ...p,
                sizes: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }))
            }
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g. S, M, L, XL"
            required
          />
          {errors.sizes && <p className="text-red-600 text-sm mt-1">{errors.sizes}</p>}
        </div>

        {/* Colors */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(", ")}
            onChange={(e) =>
              setProductData((p) => ({
                ...p,
                colors: e.target.value
                  .split(",")
                  .map((c) => c.trim())
                  .filter(Boolean),
              }))
            }
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g. Black, Olive"
            required
          />
          {errors.colors && <p className="text-red-600 text-sm mt-1">{errors.colors}</p>}
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <label
            htmlFor="imageUpload"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
          >
            Choose File
          </label>
          <input
            id="imageUpload"
            type="file"
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
          {uploading && <p className="mt-2 text-sm">Uploading image…</p>}

          <div className="flex gap-4 mt-4">
            {productData.images.map((image, i) => (
              <img
                key={i}
                src={image.url}
                alt={image.altText || "Product Image"}
                className="w-20 h-20 object-cover rounded-md shadow-md"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 disabled:opacity-60"
          disabled={uploading}
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
