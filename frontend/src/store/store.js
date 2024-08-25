import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import { loadState, saveState } from "../utils/localStorage";

//Load the initial state from local storage
const preloadedState = loadState();

// Create the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
  preloadedState,
});

// Subscribe to store changes and save the state to local storage
store.subscribe(() => {
  saveState({
    auth: store.getState().auth,
    user: store.getState().user,
  });
});
