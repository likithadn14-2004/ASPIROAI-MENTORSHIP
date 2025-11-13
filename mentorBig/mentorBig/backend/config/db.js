const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://likithadata:today@cluster0.qmu3oo0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
