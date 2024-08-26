import React from "react";
import { useSelector } from "react-redux";
import Tweet from "../AllPost/AllPost";

const MyPost = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { profile, allTweets } = useSelector((store) => store.user);

  if (!isAuthenticated) return null;

  return (
    <div className="p-4 space-y-6 overflow-y-scroll h-[80vh] max-w-screen-md mx-auto bg-gray-100">
      <div className="flex flex-col space-y-6">
        {/* User Profile */}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={profile?.profileImage}
            alt="User Profile"
            className="w-12 h-12 rounded-full border-2 border-gray-300"
          />
          <div>
            <h2 className="text-lg font-semibold">{profile?.fullName}</h2>
            <p className="text-gray-600 text-sm">@{profile?.username}</p>
          </div>
        </div>

        {/* Posts */}
        {allTweets?.tweets?.length > 0 ? (
          allTweets.tweets.map((tweet, index) => (
            <Tweet key={index} tweet={tweet} />
          ))
        ) : (
          <p className="text-gray-600">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default MyPost;
