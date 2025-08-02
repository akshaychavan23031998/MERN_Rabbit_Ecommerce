const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const Products = require("./data/products");
const products = require("./data/products");

dotenv.config();

//connect to mongoDB
mongoose.connect(process.env.MONGO_URI);

//Function to seed the data
const seedData = async () => {
  try {
    //clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // create default user admin
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@gmail.com",
      password: "admin15#OR",
      role: "admin",
    });

    //Assign the default user id to each product
    const userID = createdUser._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: userID };
    });

    //insert the products into the DB
    await Product.insertMany(sampleProducts);
    console.log("Product Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error Seeding The Data", error);
    process.exit(1);
  }
};

seedData();
