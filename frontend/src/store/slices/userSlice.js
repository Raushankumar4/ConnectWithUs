import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  profile: null,
  otherUsers: [],
  tweet: [],
  allTweets: [],
  otherTweets: [],
  myPost: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    getCreatedTweets: (state, action) => {
      state.tweet = action.payload;
    },
    getAllTweets: (state, action) => {
      state.allTweets = action.payload;
    },
    getOtherTweets: (state, action) => {
      state.otherTweets = action.payload;
    },
    getMyAllPost: (state, action) => {
      state.myPost = action.payload;
    },
    deletePost: (state, action) => {
      const postIdToDelete = action.payload;
      if (state.myPost) {
        state.myPost = state.myPost?.tweets?.filter(
          (post) => post?._id !== postIdToDelete
        );
      }
    },

    updatePost: (state, action) => {
      const updatedPost = action.payload;
      state.myPost = state.myPost?.tweets?.map((post) =>
        post?._id === updatedPost._id ? { ...post, ...updatedPost } : post
      );
    },
  },
});

export const {
  setUser,
  setProfile,
  getAllTweets,
  getCreatedTweets,
  getOtherTweets,
  setOtherUsers,
  updateUser,
  getMyAllPost,
  deletePost,
  updatePost,
} = userSlice.actions;

export default userSlice.reducer;
