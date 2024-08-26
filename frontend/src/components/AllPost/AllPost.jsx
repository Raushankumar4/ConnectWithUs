import React from "react";
import { FaRegComment, FaRegHeart, FaRegBookmark } from "react-icons/fa";

const stripHtmlTags = (html) => {
  return html.replace(/<\/?[^>]+>/gi, "");
};

const AllPost = ({ tweet }) => {
  const cleanedDescription = stripHtmlTags(tweet?.description || "");

  return (
    <div className="tweet-card mb-6 p-4 bg-white rounded-lg shadow-md">
      {/* Post Image */}
      {tweet?.postImage && (
        <img
          src={tweet?.postImage}
          alt="Post"
          className="w-full h-auto max-h-80 rounded-lg mb-4 object-cover"
        />
      )}
      {/* Post Description */}
      <p className="text-gray-800 mb-4 text-base md:text-lg lg:text-xl">
        {cleanedDescription}
      </p>
      {/* Post Actions */}
      <div className="flex items-center space-x-4 text-gray-600">
        <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-500 transition-colors duration-300">
          <FaRegComment className="w-5 h-5" />
          <span className="text-sm">{tweet?.comments?.length || 0}</span>
        </div>
        <div className="flex items-center space-x-1 cursor-pointer hover:text-red-500 transition-colors duration-300">
          <FaRegHeart className="w-5 h-5" />
          <span className="text-sm">{tweet?.likes || 0}</span>
        </div>
        <div className="flex items-center space-x-1 cursor-pointer hover:text-gray-800 transition-colors duration-300">
          <FaRegBookmark className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default AllPost;
