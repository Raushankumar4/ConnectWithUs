import React from "react";
import {
  FaRegComment,
  FaRegHeart,
  FaRegBookmark,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { deletePostThunk } from "../../store/thunk/deletePost";
import toast from "react-hot-toast";
import { useGetMyPost } from "../../hooks/useGetMyPost";

const stripHtmlTags = (html) => html.replace(/<\/?[^>]+>/gi, "");

const MyPostCard = ({ post }) => {
  const cleanedDescription = stripHtmlTags(post?.description || "");
  const { profile, user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  useGetMyPost(user?.user?._id);

  const handleDelete = () => {
    if (token) {
      dispatch(deletePostThunk({ id: post?._id, token }))
        .unwrap()
        .then(() => {
          toast.success("Post deleted successfully.");
        })
        .catch((error) => {
          console.error("Error during delete operation:", error);
          toast.error("Failed to delete the post. Please try again.");
        });
    } else {
      toast.error("No authorization token found.");
    }
  };

  const confirmAndDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      handleDelete();
    }
  };

  return (
    <div className="post-card mb-6 p-4 bg-white rounded-lg shadow-md relative">
      {/* Post Image */}
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={profile?.profileImage || "/default-profile.png"} // Added fallback image
          alt="User Profile"
          className="w-12 h-12 rounded-full border-2 border-gray-300"
        />
        <div>
          <h2 className="text-lg font-semibold">
            {profile?.fullName || "User Name"}
          </h2>
          <p className="text-gray-600 text-sm">
            @{profile?.username || "username"}
          </p>
        </div>
      </div>
      {post?.postImage && (
        <img
          src={post?.postImage}
          alt="Post"
          className="w-full h-auto max-h-80 rounded-lg mb-4 object-cover"
        />
      )}
      {/* Post Description */}
      <p className="text-gray-800 mb-4 text-base md:text-lg lg:text-xl">
        {cleanedDescription}
      </p>
      {/* Post Actions */}
      <div className="flex items-center space-x-4 text-gray-600 mb-4">
        <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-500 transition-colors duration-300">
          <FaRegComment className="w-5 h-5" />
          <span className="text-sm">{post?.comments?.length || 0}</span>
        </div>
        <div className="flex items-center space-x-1 cursor-pointer hover:text-red-500 transition-colors duration-300">
          <FaRegHeart className="w-5 h-5" />
          <span className="text-sm">{post?.likes || 0}</span>
        </div>
        <div className="flex items-center space-x-1 cursor-pointer hover:text-gray-800 transition-colors duration-300">
          <FaRegBookmark className="w-5 h-5" />
        </div>
      </div>
      {/* Edit and Delete Buttons */}
      <div className="absolute top-2 right-2 flex space-x-2">
        <button className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300">
          <FaEdit className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={confirmAndDelete}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
        >
          <FaTrash className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default MyPostCard;
