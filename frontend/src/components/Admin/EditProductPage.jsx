// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { fetchProductDetails } from "../../redux/slices/productsSlice";
// import { updateProduct } from "../../redux/slices/adminProductSlice";
// import axios from "axios";

// const EditProductPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // ✅ correct selector & key name (selectedProduct)
//   const { selectedProduct, loading, error } = useSelector(
//     (state) => state.products
//   );

//   const [productData, setProductData] = useState({
//     name: "",
//     description: "",
//     price: 0,
//     countInStock: 0,
//     sku: "",
//     category: "",
//     brand: "",
//     sizes: [],
//     colors: [],
//     collections: "",
//     material: "",
//     gender: "",
//     images: [],
//   });

//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     if (id) dispatch(fetchProductDetails(id));
//   }, [dispatch, id]);

//   // ✅ hydrate form when the product is loaded
//   useEffect(() => {
//     if (selectedProduct) {
//       setProductData({
//         name: selectedProduct.name ?? "",
//         description: selectedProduct.description ?? "",
//         price: selectedProduct.price ?? 0,
//         countInStock: selectedProduct.countInStock ?? 0,
//         sku: selectedProduct.sku ?? "",
//         category: selectedProduct.category ?? "",
//         brand: selectedProduct.brand ?? "",
//         sizes: selectedProduct.sizes ?? [],
//         colors: selectedProduct.colors ?? [],
//         collections: selectedProduct.collections ?? "",
//         material: selectedProduct.material ?? "",
//         gender: selectedProduct.gender ?? "",
//         images: selectedProduct.images ?? [],
//       });
//     }
//   }, [selectedProduct]);

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
//       // ✅ push into images
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
//     dispatch(updateProduct({ id, productData }))
//       .unwrap()
//       .then(() => navigate("/admin/products"));
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}...</p>;

//   return (
//     <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
//       <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

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

//         {/* Sizes */}
//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
//           <input
//             type="text"
//             name="sizes"
//             value={productData.sizes.join(", ")}
//             onChange={(e) =>
//               setProductData((p) => ({
//                 ...p,
//                 sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
//               }))
//             }
//             className="w-full border border-gray-300 rounded-md p-2"
//           />
//         </div>

//         {/* Colors */}
//         <div className="mb-6">
//           <label className="block font-semibold mb-2">Colors (comma-separated)</label>
//           <input
//             type="text"
//             name="colors"
//             value={productData.colors.join(", ")}
//             onChange={(e) =>
//               setProductData((p) => ({
//                 ...p,
//                 colors: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
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
//           <input id="imageUpload" type="file" onChange={handleImageUpload} className="hidden" />
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

//         <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
//           Update Product
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProductPage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails } from "../../redux/slices/productsSlice";
import { updateProduct } from "../../redux/slices/adminProductSlice";
import axios from "axios";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // productsSlice should expose { selectedProduct, loading, error }
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  // full product form state
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    discountPrice: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    // images: [{ url, altText?, publicId? }]
    images: [],
  });

  // for uploads + deletions
  const [uploading, setUploading] = useState(false);
  const [removedPublicIds, setRemovedPublicIds] = useState([]); // images to delete from Cloudinary

  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  // hydrate form when product loads
  useEffect(() => {
    if (!selectedProduct) return;

    setProductData({
      name: selectedProduct.name ?? "",
      description: selectedProduct.description ?? "",
      price: selectedProduct.price ?? 0,
      discountPrice: selectedProduct.discountPrice ?? 0,
      countInStock: selectedProduct.countInStock ?? 0,
      sku: selectedProduct.sku ?? "",
      category: selectedProduct.category ?? "",
      brand: selectedProduct.brand ?? "",
      sizes: selectedProduct.sizes ?? [],
      colors: selectedProduct.colors ?? [],
      collections: selectedProduct.collections ?? "",
      material: selectedProduct.material ?? "",
      gender: selectedProduct.gender ?? "",
      images: selectedProduct.images ?? [],
    });
    setRemovedPublicIds([]); // reset when switching product
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  /** Remove a single image from the form.
   *  If it has a Cloudinary publicId, we queue it for deletion on save.
   */
  const handleRemoveImage = (idx) => {
    setProductData((prev) => {
      const next = [...prev.images];
      const [removed] = next.splice(idx, 1);
      if (removed?.publicId) {
        setRemovedPublicIds((old) => [...old, removed.publicId]);
      }
      return { ...prev, images: next };
    });
  };

  /** Clear all images from this product in the form */
  const clearAllImages = () => {
    // collect cloudinary publicIds to delete
    const ids = (productData.images || [])
      .map((img) => img?.publicId)
      .filter(Boolean);
    if (ids.length) setRemovedPublicIds((old) => [...old, ...ids]);
    setProductData((p) => ({ ...p, images: [] }));
  };

  const handleAltChange = (idx, value) => {
    setProductData((prev) => {
      const images = [...prev.images];
      images[idx] = { ...images[idx], altText: value };
      return { ...prev, images };
    });
  };

  /** Multiple file upload → /api/upload, appends [{url, publicId, altText:""}] */
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);
          const { data } = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          // backend returns { imageUrl, publicId }
          return { url: data.imageUrl, publicId: data.publicId, altText: "" };
        })
      );

      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }));
      e.target.value = ""; // reset input
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure numeric fields are numbers
    const payload = {
      ...productData,
      price: Number(productData.price) || 0,
      discountPrice: Number(productData.discountPrice) || 0,
      countInStock: Number(productData.countInStock) || 0,
      // Send list of Cloudinary publicIds we want to destroy (optional)
      deleteImages: removedPublicIds,
    };

    dispatch(updateProduct({ id, productData: payload }))
      .unwrap()
      .then(() => navigate("/admin/products"));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            rows={4}
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Discount Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Discount Price</label>
          <input
            type="number"
            name="discountPrice"
            value={productData.discountPrice}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Count In Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Count In Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Category  */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Collections */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Collection</label>
          <input
            type="text"
            name="collections"
            value={productData.collections}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Gender</label>
          <select
            name="gender"
            value={productData.gender || ""}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="">—</option>
            <option>Men</option>
            <option>Women</option>
            <option>Unisex</option>
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
            className="w-full border rounded-md p-2"
          />
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
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Images manager */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label className="block font-semibold mb-2">Images</label>
            {productData.images?.length > 0 && (
              <button
                type="button"
                onClick={clearAllImages}
                className="text-red-600 text-sm hover:underline"
              >
                Remove all
              </button>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block"
          />
          {uploading && (
            <p className="mt-2 text-sm text-gray-500">Uploading…</p>
          )}

          {productData.images?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {productData.images.map((img, i) => (
                <div key={i} className="relative border rounded-md p-2">
                  <img
                    src={img.url}
                    alt={img.altText || `Image ${i + 1}`}
                    className="w-full h-28 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 grid place-items-center shadow"
                    title="Remove"
                  >
                    ×
                  </button>
                  <input
                    type="text"
                    placeholder="Alt text"
                    value={img.altText || ""}
                    onChange={(e) => handleAltChange(i, e.target.value)}
                    className="mt-2 w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
