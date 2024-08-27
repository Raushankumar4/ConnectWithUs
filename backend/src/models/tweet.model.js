import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    like: {
      type: Array,
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postImage: {
      type: String,
      required: false,
    },
    comment: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
