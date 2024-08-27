import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.Model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynscHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

export const createTweet = asyncHandler(async (req, res) => {
  const { description, id } = req.body;

  if (!description || !id) {
    throw new ApiError(401, "All fields are required", false);
  }

  let postImageUrl = null;

  if (req.file) {
    const postImageLocalPath = req.file.path;
    const uploadResult = await uploadOnCloudinary(postImageLocalPath);
    postImageUrl = uploadResult.url;
  }

  const tweetCreated = await Tweet.create({
    description,
    userId: id,
    postImage: postImageUrl,
  });

  if (!tweetCreated) {
    return res.status(500).json({ message: "Failed to post", success: false });
  }

  return res.status(200).json({
    message: "Post Created Successfully",
    tweetCreated,
    success: true,
  });
});

// delete tweet

export const deleteTweet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the tweet to get the image public ID
  const tweet = await Tweet.findById(id);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found", false);
  }

  // Ensure tweet.postImage is defined before trying to delete the image
  if (tweet.postImage) {
    const urlParts = tweet.postImage.split("/");
    const filename = urlParts[urlParts.length - 1];
    const publicId = filename.split(".")[0];
    console.log("urlsparts", urlParts); // Extract public ID
    console.log("filename", filename);
    console.log("public id", publicId);

    const deleteResult = await deleteFromCloudinary(publicId);

    if (!deleteResult.success) {
      throw new ApiError(
        500,
        `Failed to delete image from Cloudinary: ${deleteResult.error}`,
        false
      );
    }
  }

  // Delete the tweet from MongoDB
  await Tweet.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, "", "Tweet deleted successfully!", true));
});

// UPDATE POST

export const updateTweet = asyncHandler(async (req, res) => {
  const tweetId = req.params.id;
  const { description } = req.body;

  if (!description)
    throw new ApiError(401, "Description field is required", false);

  // Initialize variables for new image upload
  let postImageUrl = null;
  if (req.file) {
    // Handle image upload
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult) {
      throw new ApiError(500, "Failed to upload image", false);
    }
    postImageUrl = uploadResult.url;

    // Find the existing tweet to get the current image URL
    const existingTweet = await Tweet.findById(tweetId);
    if (existingTweet && existingTweet.postImage) {
      // Delete the old image from Cloudinary
      const urlParts = existingTweet.postImage.split("/");
      const filename = urlParts[urlParts.length - 1];
      const publicId = filename.split(".")[0]; // Extract public ID

      const deleteResult = await deleteFromCloudinary(publicId);
      if (!deleteResult.success) {
        throw new ApiError(
          500,
          `Failed to delete old image from Cloudinary: ${deleteResult.error}`,
          false
        );
      }
    }
  }

  // Update the tweet with new description and (optional) new image
  const updatedTweet = await Tweet.findOneAndUpdate(
    { _id: tweetId },
    { description, postImage: postImageUrl || undefined },
    { new: true }
  );

  if (!updatedTweet)
    return res
      .status(404)
      .json({ message: "You don't have any post to delete", success: false });

  if (updatedTweet)
    return res.status(200).json({
      message: "Post Updated Successfully",
      updateTweet,
      success: true,
    });
});

// like or dislike

export const likeTweetOrDislikeTweet = asyncHandler(async (req, res) => {
  const loggedInUserId = req.body.id; // taking loin user id
  const tweetId = req.params.id; // takiing tweet id

  const tweet = await Tweet.findById(tweetId);
  if (tweet.like.includes(loggedInUserId)) {
    // dislike
    await Tweet.findByIdAndUpdate(tweetId, {
      $pull: { like: loggedInUserId },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "", "User Disliked Your Tweet ", true));
  } else {
    //like
    await Tweet.findByIdAndUpdate(tweetId, {
      $push: { like: loggedInUserId },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "", "User liked Your Tweet ", true));
  }
});

// get only my tweets
export const getMyTweets = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // Find the logged-in user by their ID
  const loggedInUser = await User.findById(id);
  if (!loggedInUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Fetch the tweets for the logged-in user
  const loggedInUserTweets = await Tweet.find({ userId: id });

  // Respond with the user's tweets
  return res
    .status(200)
    .json({ message: "my post", tweets: loggedInUserTweets });
});

// getting all tweets
export const getAllTweets = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const loggedInUser = await User.findById(id);
  const loggedInUserTweets = await Tweet.find({ userId: id });
  const followingUserTweets = await Promise.all(
    loggedInUser.following.map((otherUserId) => {
      return Tweet.find({ userId: otherUserId });
    })
  );
  return res.status(200).json({
    tweets: loggedInUserTweets.concat(...followingUserTweets),
  });
});

// get following tweets
export const getFollowingtweets = asyncHandler(async (req, res) => {
  const { id } = req.params.id;

  const loggedInUser = await User.findById(id);

  const followingUserTweets = await Promise.all(
    loggedInUser.following.map((otherUserId) => {
      return Tweet.find({ userId: otherUserId });
    })
  );
  return res.status(200).json({
    tweets: [].concat(...followingUserTweets),
  });
});
