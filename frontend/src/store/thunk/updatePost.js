import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { updatePost } from "../slices/userSlice";

export const updatePostThunk = createAsyncThunk(
  "user/updatePost",
  async (updatedPost, { dispatch }) => {
    try {
      const response = await axios.put(
        `/api/posts/${updatedPost.id}`,
        updatedPost
      );
      dispatch(updatePost(response.data));
    } catch (error) {
      console.error("Failed to update the post:", error);
    }
  }
);
