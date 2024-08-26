import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  profile: null,
  otherUsers: null,
  tweet: null,
  allTweets: [],
  otherTweets: [],
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
} = userSlice.actions;
export default userSlice.reducer;
