import dotenv from 'dotenv';
import express from 'express';
import {connectDB} from "./db/index.js";
// import app from "./app.js";
// import connectCloudinary from "./cloudinary/index.js";
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import helmet from "helmet";

import cors from 'cors';
import { errorMiddleware } from './middleware/error.Middleware.js';
dotenv.config()
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
// app.use(cors({
//     origin: process.env.CORS_ORIGIN, 
//     credentials: true,
// }))
app.use(
  helmet({
    crossOriginOpenerPolicy: false, // ✅ FIX
  })
);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend-url.onrender.com", // 👈 add this
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use(errorMiddleware);
connectDB()
.then(() => {
    app.listen(process.env.PORT || 5500, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection failed !!",err);
    
})

// connectCloudinary()

