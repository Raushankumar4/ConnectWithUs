import React from "react";
import {
  FaRegComment,
  FaRegHeart,
  FaRegBookmark,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleRefresh, setSavePost } from "../../store/slices/userSlice";
import { errorToast, successToast } from "../ResusableComponents/NotifyToast";
import { backendUrl } from "../../constant";
import axios from "axios";

const AllPostCard = ({ tweet }) => {
  const { profile } = useSelector((store) => store.user);
  const { user } = useSelector((store) => store.user);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const savedPost = async (id) => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/v1/users/bookmark/${id}`,
        { id: user?.user?._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      successToast(res.data.message);
      dispatch(setSavePost(res.data));
      dispatch(toggleRefresh());
    } catch (error) {
      errorToast(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  const likeDislike = async (id) => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/v1/tweet/likes/${id}`,
        { id: user?.user?._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      successToast(res.data.message);
      dispatch(toggleRefresh());
    } catch (error) {
      console.log(error?.res?.data.message);
      errorToast("Failed to update like status.");
    }
  };

  return (
    <div className="tweet-card mb-6 p-4 bg-white rounded-lg shadow-md relative w-full max-w-md mx-auto">
      {/* User Info */}
      <div className="flex items-center space-x-4 mb-4">
        <Link to={`/profile/${user?.user?._id}`}>
          <img
            src={profile?.profileImage}
            alt="User Profile"
            className="w-12 h-12 rounded-full border-2 border-gray-300"
          />
        </Link>

        <div>
          <h2 className="text-lg  font-semibold">{profile?.fullName}</h2>
          <p className="text-gray-600 text-sm">@{profile?.username}</p>
        </div>
      </div>
      {/* Post Image */}
      {/* Post Description */}
      <p className="text-gray-800 mb-4 text-start  pl-2 md:text-lg lg:text-md">
        {tweet?.description}
      </p>
      {tweet?.postImage && (
        <div className="relative w-full   mb-4 rounded-lg overflow-hidden">
          <img
            src={tweet?.postImage}
            alt="Post"
            className="w-full  object-cover"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center space-x-4 text-gray-600">
        <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-500 transition-colors duration-300">
          <FaRegComment className="w-5 h-5" />
          <span className="text-sm">{tweet?.comments?.length || 0}</span>
        </div>
        <div className="flex items-center space-x-1 cursor-pointer hover:text-red-500 transition-colors duration-300">
          <FaRegHeart
            onClick={() => likeDislike(tweet?._id)}
            className="w-5 h-5"
          />

          <span className="text-sm">{tweet?.like.length || 0}</span>
        </div>
        <div className="flex items-center space-x-1 cursor-pointer hover:text-gray-800 transition-colors duration-300">
          <FaRegBookmark
            onClick={() => savedPost(tweet?._id)}
            className="w-5 h-5"
          />
        </div>
      </div>
      {/* Edit and Delete Buttons */}
    </div>
  );
};

export default AllPostCard;
