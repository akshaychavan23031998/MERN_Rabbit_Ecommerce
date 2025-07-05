// backend/routes/payments.js

const express = require("express");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    console.log("Order created:", order);
    res.status(200).json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Export using CommonJS style:
module.exports = router;
