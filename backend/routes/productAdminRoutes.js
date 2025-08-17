// const express = require("express");
// const Product = require("../models/Product");
// const { protect, admin } = require("../middleware/authMiddleware");

// const router = express.Router();

// // @route GET /api/admin/products
// // @desc Get all the products (admin only)
// // @access Private/admin
// router.get("/", protect, admin, async (req, res) => {
//   try {
//     const products = await Product.find({});
//     res.json(products);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server Error" });
//   }
// });

// // GET /api/admin/products/:id - single (admin)
// router.get("/:id", protect, admin, async (req, res) => {
//   try {
//     const prod = await Product.findById(req.params.id);
//     if (!prod) return res.status(404).json({ message: "Product not found" });
//     res.json(prod);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// // POST /api/admin/products - create (admin)
// // router.post("/", protect, admin, async (req, res) => {
// //   try {
// //     const product = new Product(req.body);
// //     const saved = await product.save();
// //     res.status(201).json(saved);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server Error" });
// //   }
// // });

// // PUT /api/admin/products/:id - update (admin)
// router.put("/:id", protect, admin, async (req, res) => {
//   try {
//     const prod = await Product.findById(req.params.id);
//     if (!prod) return res.status(404).json({ message: "Product not found" });

//     // update only the fields sent
//     Object.assign(prod, req.body);
//     const updated = await prod.save();
//     res.json(updated);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// // DELETE /api/admin/products/:id - delete (admin)
// router.delete("/:id", protect, admin, async (req, res) => {
//   try {
//     const prod = await Product.findById(req.params.id);
//     if (!prod) return res.status(404).json({ message: "Product not found" });

//     await prod.deleteOne();
//     res.json({ message: "Product deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// // routes/productAdminRoutes.js
// router.post("/", protect, admin, async (req, res) => {
//   try {
//     const body = sanitizeProductBody(req.body);
//     const product = new Product({ ...body, user: req.user._id });
//     const saved = await product.save();
//     return res.status(201).json(saved);
//   } catch (err) {
//     if (err?.code === 11000) {
//       return res.status(409).json({ message: "SKU already exists" });
//     }
//     if (err.name === "ValidationError") {
//       const fields = Object.fromEntries(
//         Object.entries(err.errors).map(([k, v]) => [k, v.message])
//       );
//       return res.status(400).json({ message: "Validation failed", fields });
//     }
//     console.error(err);
//     return res.status(500).json({ message: "Server Error" });
//   }
// });


// function sanitizeProductBody(b) {
//   const out = { ...b };

//   // Trim and drop empty strings for required string fields
//   ["name","description","category","collections","sku","brand","material"].forEach((k) => {
//     if (typeof out[k] === "string") {
//       out[k] = out[k].trim();
//       if (out[k] === "") delete out[k]; // ← important so "required" triggers properly
//     }
//   });

//   // Normalize gender to enum casing if provided
//   if (out.gender) {
//     const g = String(out.gender).toLowerCase();
//     if (g === "men") out.gender = "Men";
//     else if (g === "women") out.gender = "Women";
//     else out.gender = "Unisex";
//   } else {
//     delete out.gender; // don’t send empty string
//   }

//   // Convert comma-separated strings into arrays if needed
//   if (typeof out.sizes === "string") {
//     out.sizes = out.sizes.split(",").map(s => s.trim()).filter(Boolean);
//   }
//   if (typeof out.colors === "string") {
//     out.colors = out.colors.split(",").map(c => c.trim()).filter(Boolean);
//   }

//   // Coerce numbers
//   if (out.price != null) out.price = Number(out.price);
//   if (out.countInStock != null) out.countInStock = Number(out.countInStock);
//   if (out.discountPrice != null) out.discountPrice = Number(out.discountPrice);

//   return out;
// }


// module.exports = router;

// backend/routes/productAdminRoutes.js
const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

/* ---------------------- LIST / READ ---------------------- */

router.get("/", protect, admin, async (_req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id", protect, admin, async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });
    res.json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------------- CREATE ---------------------- */

router.post("/", protect, admin, async (req, res) => {
  try {
    const body = sanitizeProductBody(req.body);
    const product = new Product({ ...body, user: req.user._id });
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "SKU already exists" });
    }
    if (err.name === "ValidationError") {
      const fields = Object.fromEntries(
        Object.entries(err.errors).map(([k, v]) => [k, v.message])
      );
      return res.status(400).json({ message: "Validation failed", fields });
    }
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------------- UPDATE ---------------------- */
/**
 * PUT /api/admin/products/:id
 * Body can include:
 *  - any product fields
 *  - images: [{ url, altText?, publicId? }]  (REPLACES the whole array)
 *  - deleteImages: [publicId, ...]           (optional; destroy on Cloudinary)
 */
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });

    const { deleteImages = [], ...fields } = sanitizeProductBody(req.body);

    // merge normal fields
    Object.assign(prod, fields);

    // replace images array if provided
    if (Array.isArray(fields.images)) {
      prod.images = fields.images;
      prod.markModified("images");
    }

    // attempt to delete any Cloudinary assets the UI removed
    if (Array.isArray(deleteImages) && deleteImages.length) {
      await Promise.all(
        deleteImages.map(async (pid) => {
          try {
            if (pid) await cloudinary.uploader.destroy(pid);
          } catch (e) {
            console.warn("Cloudinary destroy failed for", pid, e?.message);
          }
        })
      );
    }

    const updated = await prod.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      const fields = Object.fromEntries(
        Object.entries(err.errors).map(([k, v]) => [k, v.message])
      );
      return res.status(400).json({ message: "Validation failed", fields });
    }
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------------- DELETE ---------------------- */
// Also clean up Cloudinary images when product is removed
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });

    // try to clean images
    const publicIds =
      (prod.images || []).map((i) => i.publicId).filter(Boolean) || [];
    if (publicIds.length) {
      await Promise.all(
        publicIds.map(async (pid) => {
          try {
            await cloudinary.uploader.destroy(pid);
          } catch (e) {
            console.warn("Cloudinary destroy failed for", pid, e?.message);
          }
        })
      );
    }

    await prod.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------------- helpers ---------------------- */

function sanitizeProductBody(b) {
  const out = { ...b };

  // trim + drop empty required strings
  ["name", "description", "category", "collections", "sku", "brand", "material"]
    .forEach((k) => {
      if (typeof out[k] === "string") {
        out[k] = out[k].trim();
        if (out[k] === "") delete out[k];
      }
    });

  // gender to enum
  if (out.gender) {
    const g = String(out.gender).toLowerCase();
    if (g === "men") out.gender = "Men";
    else if (g === "women") out.gender = "Women";
    else out.gender = "Unisex";
  } else {
    delete out.gender;
  }

  // arrays
  if (typeof out.sizes === "string")
    out.sizes = out.sizes.split(",").map((s) => s.trim()).filter(Boolean);
  if (typeof out.colors === "string")
    out.colors = out.colors.split(",").map((c) => c.trim()).filter(Boolean);

  // numbers
  if (out.price != null) out.price = Number(out.price);
  if (out.countInStock != null) out.countInStock = Number(out.countInStock);
  if (out.discountPrice != null) out.discountPrice = Number(out.discountPrice);

  // images safety: if present, coerce to array of {url, altText?, publicId?}
  if (out.images && Array.isArray(out.images)) {
    out.images = out.images
      .map((img) => ({
        url: img.url,
        altText: img.altText || "",
        publicId: img.publicId || undefined,
      }))
      .filter((img) => !!img.url);
  }

  // deleteImages can be absent or array of strings
  if (out.deleteImages && !Array.isArray(out.deleteImages)) {
    out.deleteImages = [];
  }

  return out;
}

module.exports = router;
