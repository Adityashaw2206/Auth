import { use } from "react";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
export const test = async (req, res) => {
  res.json({
    msg: "Api is working fine",
  });
};

// export const updateUser = AsyncHandler(async (req, res) => {
//   const userIdFromToken = req.user._id;
//   const userIdFromParams = req.params.id;

//   if (userIdFromToken.toString() !== userIdFromParams) {
//     throw new ApiError(403, "You can update only your account");
//   }

//   const { username, email, password, profilePicture } = req.body;

//   const user = await User.findById(userIdFromParams);
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }
//   // if (username || email) {
//   //   const existingUser = await User.findOne({
//   //     $or: [{ username }, { email }],
//   //     _id: { $ne: userIdFromParams },
//   //   });

//   //   if (existingUser) {
//   //     throw new ApiError(400, "Username or email already taken");
//   //   }
//   // }
//   if (username) user.username = username;
//   if (email) user.email = email;
//   if (profilePicture) user.profilePicture = profilePicture;

//   if (password && password.trim() !== "") {
//     if (!user.password) {
//       throw new ApiError(400, "Set a password first for this account");
//     }
//     const isSamePassword = await bcrypt.compare(password, user.password);
//     if (isSamePassword) {
//       throw new ApiError(
//         400,
//         "New password cannot be the same as the old password",
//       );
//     }
//     if (password.length < 6) {
//       throw new ApiError(400, "Password must be at least 6 characters long");
//     }
//     console.log("USER PASSWORD:", user.password);
//     console.log("NEW PASSWORD:", password);
//     user.password = await bcrypt.hash(password, 10);
//   }

//   // if (password) {
//   //   if (password.length < 6) {
//   //     throw new ApiError(400, "Password must be at least 6 characters long");
//   //   }
//   //   user.password = await bcrypt.hash(password, 10);
//   // }
//   const updatedUser = await user.save();

//   const safeUser = await User.findById(updatedUser._id).select("-password");
//   return res
//     .status(200)
//     .json(new ApiResponse(200, safeUser, "User updated successfully"));
// });

// export const updateUser = AsyncHandler(async (req, res) => {
//   const userIdFromToken = req.user._id;
//   const userIdFromParams = req.params.id;

//   if (userIdFromToken.toString() !== userIdFromParams) {
//     throw new ApiError(403, "You can update only your account");
//   }

//   const { username, email, password, profilePicture } = req.body;

//   const user = await User.findById(userIdFromParams);
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   // 🔥 ONLY CHECK UNIQUE IF FIELD EXISTS
//   if (username || email) {
//     const query = [];

//     if (username) query.push({ username });
//     if (email) query.push({ email });

//     // ✅ IMPORTANT: only run if query has values
//     if (query.length > 0) {
//       const existingUser = await User.findOne({
//         $or: query,
//         _id: { $ne: userIdFromParams },
//       });

//       if (existingUser) {
//         throw new ApiError(400, "Username or email already taken");
//       }
//     }
//   }

//   // 🔥 UPDATE ONLY PROVIDED FIELDS
//   if (username && username.trim() !== "") {
//     user.username = username;
//   }

//   if (email && email.trim() !== "") {
//     user.email = email;
//   }

//   // if (profilePicture && profilePicture.trim() !== "") {
//   //   user.profilePicture = profilePicture;
//   // }
//   if (profilePicture) {
//     user.profilePicture = profilePicture;
//   }

//   // 🔐 PASSWORD UPDATE (SAFE)
//   if (password && typeof password === "string" && password.trim() !== "") {
//     if (!user.password) {
//       throw new ApiError(400, "Set a password first (Google account)");
//     }

//     const isSame = await bcrypt.compare(password, user.password);
//     if (isSame) {
//       throw new ApiError(400, "New password cannot be same as old");
//     }

//     if (password.length < 6) {
//       throw new ApiError(400, "Password must be at least 6 characters");
//     }

//     user.password = await bcrypt.hash(password, 10);
//   }
//   console.log("REQ BODY:", req.body);
//   console.log("USER BEFORE SAVE:", user);
//   const updatedUser = await user.save();

//   const safeUser = await User.findById(updatedUser._id).select("-password");

//   return res
//     .status(200)
//     .json(new ApiResponse(200, safeUser, "User updated successfully"));
// });

export const updateUser = AsyncHandler(async (req, res) => {
  const userIdFromToken = req.user._id;
  const userIdFromParams = req.params.id;

  console.log("REQ BODY:", req.body);
  console.log("USER FROM TOKEN:", req.user);
  console.log("PARAM ID:", req.params.id);

  if (userIdFromToken.toString() !== userIdFromParams) {
    throw new ApiError(403, "You can update only your account");
  }

  const { username, email, password, profilePicture } = req.body;

  const updateFields = {};

  if (username) updateFields.username = username;
  if (email) updateFields.email = email;
  if (profilePicture) updateFields.profilePicture = profilePicture;

  // 🔐 PASSWORD
  if (password) {
    const user = await User.findById(userIdFromParams);

    if (!user) throw new ApiError(404, "User not found");

    if (!user.password) {
      throw new ApiError(400, "Set password first (Google account)");
    }

    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) {
      throw new ApiError(400, "New password cannot be same as old");
    }

    updateFields.password = await bcrypt.hash(password, 10);
  }

  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, "No data to update");
  }

  console.log("FINAL UPDATE:", updateFields);

  const updatedUser = await User.findByIdAndUpdate(
    userIdFromParams,
    { $set: updateFields }, // 🔥 IMPORTANT
    { new: true, runValidators: true },
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

export const deleteUser = AsyncHandler(async (req, res) => {
  // console.log("TOKEN USER:", req.user);
  // console.log("PARAM ID:", req.params.id);

  if (req.user._id.toString() !== req.params.id) {
    throw new ApiError(403, "You can delete only your account");
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  await user.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});
