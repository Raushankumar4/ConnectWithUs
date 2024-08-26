import React from "react";
import { useSelector } from "react-redux";
import AllPostCard from "../PostCard/AllPostCard";

const AllPost = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { allTweets } = useSelector((store) => store.user);

  if (!isAuthenticated) return null;

  return (
    <div className="p-4 space-y-6 overflow-y-scroll h-[80vh] max-w-screen-md mx-auto bg-gray-100">
      <div className="flex flex-col space-y-6">
        {/* Posts */}
        {allTweets?.tweets?.length > 0 ? (
          allTweets.tweets.map((tweet, index) => (
            <AllPostCard key={index} tweet={tweet} />
          ))
        ) : (
          <p className="text-gray-600">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default AllPost;
