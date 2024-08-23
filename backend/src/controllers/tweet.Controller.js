import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.Model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynscHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

export const createTweet = asyncHandler(async (req, res) => {
  const { description, id } = req.body;

  if (!description || !id)
    throw new ApiError(401, "all field are required", false);

  // Use req.file for single file upload
  const postImageLocalPath = req.file.path; // Get the file path
  const uploadResult = await uploadOnCloudinary(postImageLocalPath);

  const tweetCreated = await Tweet.create({
    description,
    userId: id,
    postImage: uploadResult.url,
  });

  // if (!tweetCreated) throw new ApiError(500, "Internal Server Error", false);

  return res
    .status(200)
    .json(
      new ApiResponse(200, tweetCreated, "tweet Created Succcessfully", true)
    );
});

// delete tweet

// export const deleteTweet = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   await Tweet.findByIdAndDelete(id);
//   return res
//     .status(200)
//     .json(new ApiResponse(200, "", "Tweet Deleted Successfully !", true));
// });

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

  if (!updatedTweet) throw new ApiError(404, "Tweet not found", false);

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTweet, "Tweet updated successfully", true)
    );
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

// getting all tweets
export const getAllTweets = asyncHandler(async (req, res) => {
  const { id } = req.params.id;

  const loggedInUser = await User.findById(id);
  const loggedInUserTweets = await Tweet.find({ User: id });
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