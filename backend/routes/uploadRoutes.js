// const express = require("express");
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const streamifier = require("streamifier");

// require("dotenv").config();

// const router = express.Router();

// //cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// //multer setup using memory storage (this will store the image in RAM not in file uploads)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No File Uploaded" });
//     }

//     //function to handle the stream upload to clodinary
//     const streamUpload = (fileBuffer) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream((error, result) => {
//           if (result) {
//             resolve(result);
//           } else {
//             reject(error);
//           }
//         });

//         //use streamifier to convert file buffer to a stream
//         streamifier.createReadStream(fileBuffer).pipe(stream);
//       });
//     };

//     //call the stream upload function
//     const result = await streamUpload(req.file.buffer);

//     //responded with the uploaded image URL
//     res.json({ imageUrl: result.secure_url });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server Error" });
//   }
// });

// module.exports = router;

// backend/routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No File Uploaded" });

    const streamUpload = (fileBuffer) =>
      new Promise((resolve, reject) => {
        // (optional) add folder in options if you want: { folder: "rabbit/products" }
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });

    const result = await streamUpload(req.file.buffer);

    // Return BOTH url and publicId so we can later destroy
    res.json({ imageUrl: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
