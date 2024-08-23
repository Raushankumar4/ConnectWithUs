import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynscHandler.js";
import { ApiError } from "../utils/apiError.js";
import dotenv from "dotenv";

dotenv.config();

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  // console.log(token);

  if (!token) throw new ApiError(401, "", "User not authenticated", false);

  const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY, {
    expiresIn: "2d",
  });
  console.log(decode);
  if (!decode) {
    return res.status(403).json({ message: "Invalid token hai" });
  }
  // console.log(decode);
  req.user = decode.user;
  next();
});

// import jwt from "jsonwebtoken";
// import { asyncHandler } from "../utils/asynscHandler.js";
// import { ApiError } from "../utils/apiError.js";
// import { User } from "../models/user.Model.js";

// export const isAuthenticated = asyncHandler(async (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return next(new ApiError(401, "No token provided"));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.user);

//     if (!user) {
//       return next(new ApiError(401, "User not found"));
//     }

//     req.user = user; // Attach user to request object
//     next();
//   } catch (error) {
//     return next(new ApiError(401, "Invalid token"));
//   }
// });
