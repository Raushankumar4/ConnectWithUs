import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/slices/authSlice";
import Sidebar from "../../Sidebar/SideBar";
import ForYou from "../../Foryou/Foryou";
import Following from "../../Following/Following";
import { backendUrl } from "../../../constant";
import { useGetAllPost } from "../../../hooks/useGetAllPost";
import { useGetProfile } from "../../../hooks/useGetProfile";

const Home = () => {
  const [currentView, setCurrentView] = useState("forYou");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { user } = useSelector((store) => store.user);
  useGetAllPost(user?.user?._id);
  useGetProfile(user?.user?._id);

  const logoutUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/users/logout`);

      dispatch(logout());
      localStorage.removeItem("reduxState");
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred during logout"
      );
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar onLogout={logoutUser} />
      <main className="flex-1 bg-gray-100 border-l border-gray-200 lg:mt-2">
        <div className="p-4 flex flex-col items-center">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setCurrentView("forYou")}
              className={`py-2 px-4 rounded-full ${
                currentView === "forYou"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              For You
            </button>
            <button
              onClick={() => setCurrentView("following")}
              className={`py-2 px-4 rounded-full ${
                currentView === "following"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Following
            </button>
          </div>
          <div className="flex justify-center items-center w-full h-full p-4">
            {currentView === "forYou" && <ForYou />}
            {currentView === "following" && <Following />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
