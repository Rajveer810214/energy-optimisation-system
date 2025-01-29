import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = (roles = []) => asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      throw new ApiError(401, "Invalid Token Access");
    }

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid User Access");
    }

    // Check if the user's role matches the allowed roles
    if (roles.length && !roles.includes(user.role)) {
      throw new ApiError(403, "Access Denied");
    }

    req.user = user; // Attach user object to the request
    next();
  } catch (error) {
    throw new ApiError(400, error?.message || "Token not found");
  }
});

export default verifyJWT;
