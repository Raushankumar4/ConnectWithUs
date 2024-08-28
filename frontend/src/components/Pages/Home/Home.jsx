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
import OtherUser from "../../OtherUsers/OtherUser";
import { useGetOtherUsers } from "../../../hooks/useGetOtherUsers";

const Home = () => {
  const [currentView, setCurrentView] = useState("forYou");
  const [searchQuery, setSearchQuery] = useState(""); // For managing search input
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { user } = useSelector((store) => store.user);
  useGetAllPost(user?.user?._id);
  useGetProfile(user?.user?._id);
  useGetOtherUsers(user?.user?._id);

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
      {/* Sidebar for larger screens */}
      <Sidebar onLogout={logoutUser} className="hidden lg:block" />
      <main className="flex-1 flex flex-col lg:flex-row bg-gray-100 border-l border-gray-200">
        {/* Main Content Area */}
        <div className="flex-1 p-4">
          <div className="flex gap-4  pl-[12vw] mb-4">
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
          <div className="flex flex-col items-center w-full h-full">
            {currentView === "forYou" && <ForYou />}
            {currentView === "following" && <Following />}
          </div>
        </div>
        {/* Sidebar for smaller screens */}
        <div className="w-full lg:w-[26vw] p-4 border-l border-gray-200 flex flex-col">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg mb-4 w-full"
          />
          <div className="bg-gray-200 rounded-md shadow-md h-auto flex flex-col">
            <div>
              <h1 className="text-black font-bold text-xl p-2">
                Who to follow
              </h1>
            </div>
            <OtherUser />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
