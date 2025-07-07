const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/orders/my-orders
//@Desc get logged in users orders
//@access private
router.get("/my-orders", protect, async (req, res) => {
  try {
    // find the orders fir authenticated user
    const order = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); //sort by most recent orders
    res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//@route GET /api/orders/:id
//@Desc get order details by ID
//@access private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order Not Found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
