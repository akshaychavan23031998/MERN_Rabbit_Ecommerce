const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentsRoutes = require("./routes/payments.js");
const checkoutRoutes = require("./routes/checkoutRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes.js");
const subscribeRoute = require("./routes/subscriberRoutes.js");
const adminRoute = require("./routes/adminRoutes.js");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();
// console.log(process.env.PORT);

const PORT = process.env.PORT || 3000;

//connect to DB
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome To Rabbit API!");
});

//API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscribeRoute);

//Admin Routes
app.use("/api/admin/users", adminRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
