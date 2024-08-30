import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CiHome } from "react-icons/ci";
import { MdOutlineTravelExplore } from "react-icons/md";
import { PiBookmarkSimple } from "react-icons/pi";
import { AiOutlineLogout } from "react-icons/ai";
import { IoLogoAndroid } from "react-icons/io";
import { HiMenu } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
import MyPost from "../UserPost/MyPost";
import Modal from "../ResusableComponents/Modal";
import Post from "../Post/Post";

const Sidebar = ({ onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMyPostOpen, setIsMyPostOpen] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);

  const { user } = useSelector((store) => store.user);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden absolute top-4 left-4 text-black text-3xl z-50"
      >
        <HiMenu />
      </button>

      <div
        className={`fixed inset-0 lg:bg-gray-100 bg-gray-200 text-black w-64 box-content flex flex-col font-semibold text-lg tracking-wide space-y-4 p-4 lg:relative lg:w-72 lg:block transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 `}
      >
        <Link className="flex items-center py-4 lg:mt-0 mt-10 text-2xl font-bold">
          <IoLogoAndroid className="w-12 h-12 mr-2" />
          <span className="md:inline">Connect </span>
        </Link>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                to="/home"
                className="flex items-center py-2 px-4 rounded-md transition-colors hover:bg-gray-300"
              >
                <CiHome className="w-6 h-6 mr-3" />
                <span className="md:inline">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${user?.user?._id}`}
                className="flex items-center py-2 px-4 rounded-md transition-colors hover:bg-gray-300"
              >
                <CgProfile className="w-6 h-6 mr-3" />
                <span className="md:inline">Profile</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => setIsMyPostOpen((prev) => !prev)}
                className="flex items-center py-2 px-4 rounded-md transition-colors hover:bg-gray-300"
              >
                <MdOutlineTravelExplore className="w-6 h-6 mr-3" />
                <span className="md:inline">My Post</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setIsPostOpen((prev) => !prev)}
                className="flex items-center py-2 px-4 rounded-md transition-colors hover:bg-gray-300"
              >
                <MdOutlineTravelExplore className="w-6 h-6 mr-3" />
                <span className="md:inline">Post</span>
              </button>
            </li>
            <li>
              <Link
                to="/bookmarks"
                className="flex items-center py-2 px-4 rounded-md transition-colors hover:bg-gray-300"
              >
                <PiBookmarkSimple className="w-6 h-6 mr-3" />
                <span className="md:inline">Bookmarks</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center py-2 px-4 rounded-md transition-colors hover:bg-gray-300"
              >
                <PiBookmarkSimple className="w-6 h-6 mr-3" />
                <span className="md:inline">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        <button
          onClick={onLogout}
          className="flex items-center py-2 px-4 rounded-md transition-colors hover:bg-gray-300"
        >
          <AiOutlineLogout className="w-6 h-6 mr-3" />
          <span className="md:inline">Logout</span>
        </button>
      </div>
      <Modal isOpen={isMyPostOpen} onClose={() => setIsMyPostOpen(false)}>
        <MyPost />
      </Modal>
      <Modal isOpen={isPostOpen} onClose={() => setIsPostOpen(false)}>
        <Post />
      </Modal>
    </div>
  );
};

export default Sidebar;
