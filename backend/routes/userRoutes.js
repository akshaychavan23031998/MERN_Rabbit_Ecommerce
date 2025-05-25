const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { model } = require("mongoose");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST api/user/register
// @desc register a new user (create a new user)
// @access for public

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Register logic
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User Already Exists" });

    user = new User({ name, email, password });
    await user.save();

    //create JWT Payload
    const payload = { user: { id: user._id, role: user.role } };
    //sign and return the token along with the user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;
        // send the user and token in response
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    res.send(500).send("Server Error");
  }
});

// @route POST api/user/login
// @desc authenticate user
// @access for public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });
    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    //create JWT Payload
    const payload = { user: { id: user._id, role: user.role } };
    //sign and return the token along with the user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;
        // send the user and token in response
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.log(err);
    res.status(500).send("server error");
  }
});

// @route GET /api/users/profile
// @desc Get loggedin user profile (protected route)
// @access private
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
