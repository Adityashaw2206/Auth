import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import { errorMiddleware } from "../utils/error.Middleware";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessToken, generateRefreshToken } from "../utils/Token.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { application } from "express";
export const signUp = AsyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    [username, email, password].some((field) => !field || field.trim() == "")
  ) {
    throw new ApiError(400, "All fields are required and cannot be empty");
  }
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new ApiError(
      400,
      "This email or username is already in use. Please choose another one.",
    );
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken({
    _id: newUser._id,
    email: newUser.email,
    username: newUser.username,
  });
  const refreshToken = generateRefreshToken({
    _id: newUser._id,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: newUser,
        accessToken,
      },
      "User registered successfully",
    ),
  );
});

// export const signUp = AsyncHandler(async (req, res, next) => {
//   try {
//     console.log("REQ BODY:", req.body); // 🔥 ADD THIS

//     const { username, email, password } = req.body;

//     if (
//       [username, email, password].some((field) => !field || field.trim() === "")
//     ) {
//       throw new ApiError(400, "All fields are required and cannot be empty");
//     }

//     const existingUser = await User.findOne({
//       $or: [{ email }, { username }],
//     });

//     if (existingUser) {
//       throw new ApiError(400, "User already exists");
//     }

//     if (password.length < 6) {
//       throw new ApiError(400, "Password must be at least 6 characters long");
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     const accessToken = generateAccessToken({
//       _id: newUser._id,
//       email: newUser.email,
//       username: newUser.username,
//     });

//     const refreshToken = generateRefreshToken({
//       _id: newUser._id,
//     });

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     });

//     return res.status(201).json({
//       user: newUser,
//       accessToken,
//     });
//   } catch (err) {
//     console.log("🔥 SIGNUP ERROR:", err); // 🔥 IMPORTANT
//     res.status(500).json(err.message);
//   }
// });

export const refreshToken = (req, res) => {
  // read cookie
  // verify refresh token
  // send new access token

  const token = req.cookies.refreshToken;
  if (!token) {
    throw new ApiError(401, "No refresh token provided");
  }
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json(new ApiError(403, "Invalid refresh token"));
    const newAccessToken = generateAccessToken({ _id: user.id });

    res.status(200).json({
      accessToken: newAccessToken,
    });
  });
};

// export const login = AsyncHandler(async (req, res, next) => {
//   const { email, password } = req.body;
//   // if ([email, password].some((field) => !field || field.trim() == "")) {
//   //   throw new ApiError(400, "Email and password both are required");
//   // }
//   if (!email || !password) {
//     throw new ApiError(400, "Email and password are required");
//   }
//   const user = await User.findOne({
//     email,
//   });
//   if (!user) {
//     throw new ApiError(400, "Invalid email or password");
//   }
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     throw new ApiError(400, "Invalid credentials");
//   }
//   const accessToken = generateAccessToken({
//     _id: user._id,
//     email: user.email,
//     username: user.username,
//   });
//   const refreshToken = generateRefreshToken({
//     _id: user._id,
//   });

//   const loggedInUser = await User.findById(user._id).select("-password");
//   const options = {
//     httpOnly: true,
//     secure: true,
//   };
//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     // secure: false,
//     // secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   });
//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         user: loggedInUser,
//         accessToken,
//       },
//       "User logged in successfully",
//     ),
//   );
// });

export const login = AsyncHandler(async (req, res) => {
  // console.log("REQ BODY:", req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  // console.log("LOGIN USER:", user);

  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  // 🔥 IMPORTANT FIX
  if (!user.password) {
    throw new ApiError(400, "This account uses Google login");
  }
;

  let isPasswordValid;

  try {
    isPasswordValid = await bcrypt.compare(password, user.password);
    // console.log("COMPARE RESULT:", isPasswordValid);
  } catch (err) {
    // console.log("BCRYPT ERROR:", err.message);
    throw new ApiError(500, "Password comparison failed");
  }

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials");
  }
  // console.log("Generating token...");
  
  const accessToken = generateAccessToken({
    _id: user._id,
    email: user.email,
    username: user.username,
  });

  const refreshToken = generateRefreshToken({
    _id: user._id,
  });
  // console.log("Token generated");
  const loggedInUser = await User.findById(user._id).select("-password");

  res.cookie("refreshToken", refreshToken, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
      },
      "User logged in successfully",
    ),
  );
});

export const googleAuth = AsyncHandler(async (req, res) => {
  // console.log("🔥 GOOGLE BODY:", req.body); // DEBUG
  const { email, username, profilePicture } = req.body;

  // 1️⃣ validate input
  if (!email || !username) {
    throw new ApiError(400, "Email and Username required");
  }

  // 2️⃣ check if user exists
  let user = await User.findOne({ email });

  // 3️⃣ if not exists → create new user
  if (!user) {
    // generate username
    const baseUsername = username.replace(/\s+/g, "").toLowerCase();
    const randomSuffix = Math.random().toString(36).slice(-5);
    const generatedUsername = baseUsername + randomSuffix;

    // generate random password
    const randomPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    user = await User.create({
      username: generatedUsername,
      email,
      password: hashedPassword,
      profilePicture, // optional
    });
  }

  // 4️⃣ generate tokens
  const accessToken = generateAccessToken({
    _id: user._id,
    email: user.email,
    username: user.username,
  });

  const refreshToken = generateRefreshToken({
    _id: user._id,
  });

  // 5️⃣ remove password
  const loggedInUser = await User.findById(user._id).select("-password");

  // 6️⃣ set refresh token cookie
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
    sameSite: "lax",
    // maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  // 7️⃣ send response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
      },
      "Google login successful",
    ),
  );
});

export const logout = AsyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json(new ApiResponse(200, "Logged out successfully"));
});
