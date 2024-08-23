import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/slices/authSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const logoutUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/users/logout"
      );

      toast.success(response.data.message);
      dispatch(logout());

      // Navigate to the home page or login page

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  };

  return (
    <>
      {isAuthenticated && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <h1 className="text-2xl font-bold mb-4">Home</h1>
          <div>
            <button
              onClick={logoutUser}
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
