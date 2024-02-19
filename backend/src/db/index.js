import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const DbConnection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    ); //MONGODB_URI: db connection string imported from constants.js DB_NAME imported from constants.js
    console.log(
      `\n MONGO DB CONNECTED DB HOST: ${DbConnection.connection.host}`,
    );
  } catch (error) {
    console.log("DB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
