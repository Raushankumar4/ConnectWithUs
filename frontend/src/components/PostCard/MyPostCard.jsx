import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiHeart } from "react-icons/ci";

import {
  FaHeart as FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { deletePostThunk } from "../../store/thunk/deletePost";
import { useGetMyPost } from "../../hooks/useGetMyPost";
import { errorToast, successToast } from "../ResusableComponents/NotifyToast";
import Modal from "../ResusableComponents/Modal";
import UpdatePost from "../UpdatePost/UpdatePost";
import { backendUrl } from "../../constant";

const stripHtmlTags = (html) => html.replace(/<\/?[^>]+>/gi, "");

const MyPostCard = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const cleanedDescription = stripHtmlTags(post?.description || "");
  const { profile, user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const userId = user?.user?._id;
  console.log(post);

  useGetMyPost(userId);

  useEffect(() => {
    setIsLiked(post?.likes?.includes(userId) || false);
  }, [post, userId]);

  const likeDislike = async () => {
    if (!userId || !token || !post?._id) return;
    try {
      const res = await axios.put(
        `${backendUrl}/api/v1/tweet/likes/${post?._id}`,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setIsLiked((prev) => !prev);
      successToast(res.data.message || "Action successful");
    } catch (error) {
      console.error("Error liking/unliking post:", error.message);
      errorToast("Failed to update like status.");
    }
  };

  const handleDelete = () => {
    if (token) {
      dispatch(deletePostThunk({ id: post?._id, token }))
        .unwrap()
        .then(() => successToast("Post deleted successfully."))
        .catch((error) => {
          console.error("Error during delete operation:", error);
          errorToast("Failed to delete the post. Please try again.");
        });
    } else {
      errorToast("No authorization token found.");
    }
  };

  const confirmAndDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      handleDelete();
    }
  };

  return (
    <div className="post-card mb-6 p-4 bg-white rounded-lg shadow-md relative">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={profile?.profileImage || "/default-profile.png"}
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
      <p className="text-gray-800 mb-4 text-base md:text-lg lg:text-xl">
        {cleanedDescription}
      </p>
      <div className="flex items-center space-x-4 text-gray-600 mb-4">
        <div
          onClick={likeDislike}
          className="flex items-center space-x-1 cursor-pointer hover:text-red-500 transition-colors duration-300"
        >
          {isLiked ? (
            <FaHeart className="w-5 h-5 text-red-500" />
          ) : (
            <CiHeart className="w-5 h-5" />
          )}
          <span className="text-sm">{post?._id}</span>
        </div>

        <div className="flex items-center space-x-1 cursor-pointer hover:text-gray-800 transition-colors duration-300">
          <FaRegBookmark className="w-5 h-5" />
        </div>
      </div>
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
        >
          {isOpen ? "" : <FaEdit className="w-5 h-5 text-gray-600" />}
        </button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <UpdatePost postId={post?._id} post={post} />
        </Modal>
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
