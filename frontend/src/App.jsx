import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { setToken } from "./store/slices/authSlice";
// import { setUser, setProfile } from "./store/slices/userSlice";
// import axios from "axios";
// import { backendUrl } from "./constant";
import RegisterUser from "./components/Pages/RegisterUser/RegisterUser";

const App = () => {
  const dispatch = useDispatch();
  // const token = useSelector((state) => state.auth.token);
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // useEffect(() => {
  //   // Check token and user data in localStorage
  //   const storedToken = localStorage.getItem("token");
  //   const storedUser = localStorage.getItem("user");
  //   const storedProfile = localStorage.getItem("profile");

  //   if (storedToken) {
  //     dispatch(setToken(storedToken));
  //   }

  //   if (storedUser) {
  //     dispatch(setUser(JSON.parse(storedUser)));
  //   }

  //   if (storedProfile) {
  //     dispatch(setProfile(JSON.parse(storedProfile)));
  //   }

  //   // Optionally, fetch user details from backend if not in localStorage
  // }, [dispatch]);

  return (
    <div>
      <RegisterUser />
    </div>
  );
};

export default App;
