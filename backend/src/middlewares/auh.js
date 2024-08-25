import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynscHandler.js";
import { ApiError } from "../utils/apiError.js";
import dotenv from "dotenv";

dotenv.config();

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(401, "No token provided", "User not authenticated")
    );
  }

  // Extract token value from header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach user to request object
    req.user = decoded.user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle different types of errors
    if (error.name === "TokenExpiredError") {
      return next(
        new ApiError(401, "Token expired", "User session has expired")
      );
    }
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(403, "Invalid token", "The token is not valid"));
    }
    // Handle any other errors
    return next(
      new ApiError(
        500,
        "Internal server error",
        "An error occurred during authentication"
      )
    );
  }
});
