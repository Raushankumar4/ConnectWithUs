import { User } from "../models/user.Model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynscHandler.js";
import bcrypt from "bcrypt";
import validator from "validator";
import {
  generateToken,
  removeTokenCookie,
  setTokenCookie,
} from "../utils/generateToken.js";
import dotenv from "dotenv";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

dotenv.config();

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, password, email } = req.body;

  // Checking all fields are not empty
  if (!fullName || !username || !email || !password)
    throw new ApiError(401, "All fields are required");

  // Validate email
  if (!validator.isEmail(email))
    throw new ApiError(400, "Invalid email Please write correct email");

  // Validate password length (more than 6 characters)
  if (password.length <= 6)
    throw new ApiError(400, "Password must be longer than 6 characters");

  // Check if the user already exists in the database
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser)
    return res.status(409).json({ message: "User already exists" });

  // Hash the password before creating the user
  const hashPassword = await bcrypt.hash(password, 16);

  // checking for files
  //profile image
  const profileLocalPath = req.files?.profileImage[0].path;

  // coverImage
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  const profileImage = await uploadOnCloudinary(profileLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const user = await User.create({
    fullName,
    username,
    email,
    password: hashPassword,
    profileImage: profileImage.url,
    coverImage: coverImage.url,
  });

  if (!user) throw new ApiError(500, "Error while registering user");

  const createdUser = await User.findById(user._id).select("-password");
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Register Succesfully", true));
});

// login user

// export const loginUser = asyncHandler(async (req, res) => {

//   const { email, password } = req.body;

//   if (!email || !password) throw new ApiError(401, "Field reuired");

//   const user = await User.findOne({ email });

//   if (!user)
//     throw new ApiError(401, "User does not exist with email or username !");

//   const isPasswordMatch = await bcrypt.compare(password, user.password);

//   if (!isPasswordMatch) throw new ApiError(401, "Inavlid Credential");

//   // generating token for user
//   const tokenData = {
//     user: user._id,
//   };
//   const token = jwt.sign(tokenData, process.env.JWT_SECERET, {
//     expiresIn: "2d",
//   });
//   return res
//     .status(201)
//     .cookie("token", token, { expiresIn: "2d", httpOnly: true })
//     .json(new ApiResponse(201, token, `Welcome ${user.fullName}`, true));
// });

// // logout user

// export const logOutUser = asyncHandler(async (_, res) => {
//   return res
//     .cookie("token", "", { maxAge: 0 })
//     .json(new ApiResponse(200, "", "User Logout Successfully", true));
// });
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Validate all required fields
  if (!email || !password || !confirmPassword) {
    throw new ApiError(
      401,
      "Email, password, and confirm password are required"
    );
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "User does exist with this email" });
  }

  // Check if the password matches
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Incorrect password " });
  }

  // Generate token for user
  const token = generateToken(user._id);

  // Set token cookie
  setTokenCookie(res, token);

  return res
    .status(200)
    .json({ message: `Welcome ${user.fullName}`, token, success: true });
});

// Logout user
export const logOutUser = asyncHandler(async (req, res) => {
  // Remove token cookie
  removeTokenCookie(res);
  return res
    .status(200)
    .json(new ApiResponse(200, "", `User logged out successfully`, true));
});
// book marks

export const saveandunsaveBookMarks = asyncHandler(async (req, res) => {
  const loggedInUserId = req.body.id;
  const tweetId = req.params.id;

  const user = await User.findById(loggedInUserId);
  if (user.bookmarks.includes(tweetId)) {
    //remove
    await User.findByIdAndUpdate(loggedInUserId, {
      $pull: { bookmarks: tweetId },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "", "bookmarks removed successfully", true));
  } else {
    // add books and save
    await User.findByIdAndUpdate(loggedInUserId, {
      $push: { bookmarks: tweetId },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "", "bookmarks Added successfully", true));
  }
});

// get profile

export const getProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  return res.status(200).json(new ApiResponse(201, user, "my profile", true));
});

// export const  upadate profile

export const updateProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fullName } = req.body;
  let profileImageLocalPath = req.files?.profileImage?.[0]?.path;
  let coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // Validate required fields
  if (!fullName && !profileImageLocalPath && !coverImageLocalPath) {
    throw new ApiError(400, "No fields to update");
  }

  // Find the user by ID
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prepare updates
  const updates = {};
  if (fullName) updates.fullName = fullName;

  // Handle profile image upload if present
  if (profileImageLocalPath) {
    const profileImage = await uploadOnCloudinary(profileImageLocalPath);
    updates.profileImage = profileImage.url;
  }

  // Handle cover image upload if present
  if (coverImageLocalPath) {
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    updates.coverImage = coverImage.url;
  }

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true,
  }).select("-password");

  if (!updatedUser) {
    throw new ApiError(500, "Error updating user profile");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Profile updated successfully", true)
    );
});

// get all other users
export const getOtherUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const otherUsers = await User.find({ _id: { $ne: id } }).select("-password");

  if (!otherUsers) throw new ApiError(401, "Curently there is No Users");

  return res
    .status(201)
    .json(new ApiResponse(200, otherUsers, "All Users", true));
});

// follow user

export const followUser = asyncHandler(async (req, res) => {
  const loggeInUserId = req.body.id;
  const userId = req.params.id;

  const loggedInUser = await User.findById(loggeInUserId);
  const user = await User.findById(userId);

  if (!user.followers.includes(loggeInUserId)) {
    await user.updateOne({ $push: { followers: loggeInUserId } });
    await loggedInUser.updateOne({ $push: { following: userId } });
  } else {
    return res
      .status(400)
      .json(new ApiResponse(400, `User Already to follow ${user.fullName}`));
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        `${loggedInUser.fullName} just follow to ${user.fullName}`
      )
    );
});

// unfollow user

export const unFollowUser = asyncHandler(async (req, res) => {
  const loggeInUserId = req.body.id;
  const userId = req.params.id;

  const loggedInUser = await User.findById(loggeInUserId);
  const user = await User.findById(userId);

  if (loggedInUser.following.includes(userId)) {
    await user.updateOne({ $pull: { followers: loggeInUserId } });
    await loggedInUser.updateOne({ $pull: { following: userId } });
  } else {
    return res.status(400).json(new ApiResponse(400, `User not following yet`));
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        `${loggedInUser.fullName} just unfollow to ${user.fullName}`
      )
    );
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Validate required fields
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  if (newPassword.length <= 6) {
    throw new ApiError(400, "New password must be longer than 6 characters");
  }

  // Find the user by ID
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if current password is correct
  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  // Hash the new password
  const hashPassword = await bcrypt.hash(newPassword, 16);

  // Update password
  user.password = hashPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully", true));
});