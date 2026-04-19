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

export const updateUser = AsyncHandler(async (req, res) => {
  const userIdFromToken = req.user._id;
  const userIdFromParams = req.params.id;
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
