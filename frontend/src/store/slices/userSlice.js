import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  profile: null,
  otherUsers: null,
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
  },
});

export const { setUser, setProfile, setOtherUsers, updateUser } =
  userSlice.actions;
export default userSlice.reducer;
