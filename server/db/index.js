import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

export const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected || DB host : ${connectionInstance.connection.host} `)
    } catch (error) {
        console.log(`\n MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}