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
import { toggleRefresh } from "../../store/slices/userSlice";
import { errorToast, successToast } from "../ResusableComponents/NotifyToast";
import { backendUrl } from "../../constant";
import axios from "axios";

const stripHtmlTags = (html) => {
  return html.replace(/<\/?[^>]+>/gi, "");
};

const AllPostCard = ({ tweet }) => {
  const cleanedDescription = stripHtmlTags(tweet?.description || "");
  const { profile } = useSelector((store) => store.user);
  const { user } = useSelector((store) => store.user);

  const handleEdit = () => {
    console.log("Edit button clicked");
  };

  const handleDelete = () => {
    console.log("Delete button clicked");
  };

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const userId = user?.user?._id;

  const likeDislike = async (id) => {
    if (!userId || !token || !id) return;

    try {
      const res = await axios.put(
        `${backendUrl}/api/v1/tweet/likes/${id}`,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      dispatch(toggleRefresh());
      if (res.data.success) {
        successToast(res.data.message);
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error.response.data.message);
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
        {cleanedDescription}
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
          <FaRegHeart className="w-5 h-5" />
          <button onClick={() => likeDislike(tweet?._id)}>like</button>
          <span className="text-sm">{tweet?.like.length || 0}</span>
        </div>
        <div className="flex items-center space-x-1 cursor-pointer hover:text-gray-800 transition-colors duration-300">
          <FaRegBookmark className="w-5 h-5" />
        </div>
      </div>
      {/* Edit and Delete Buttons */}
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          onClick={handleEdit}
          className="p-2 text-gray-600 hover:text-blue-500 transition-colors duration-300"
        >
          <FaEdit className="w-5 h-5" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-600 hover:text-red-500 transition-colors duration-300"
        >
          <FaTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AllPostCard;
