const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected Successfully");
  } catch (err) {
    console.log("Connection Failed", err);
    process.exit(1); // Use it here to stop the app only on error
  }
};

module.exports = connectDB;
