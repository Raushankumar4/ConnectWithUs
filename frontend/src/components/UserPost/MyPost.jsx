import React from "react";
import { useSelector } from "react-redux";
import MyPostCard from "../PostCard/MyPostCard";

const MyPost = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { myPost } = useSelector((store) => store.user);
  if (!isAuthenticated) return null;
  console.log("mypost", myPost?.tweets);

  return (
    <div className="p-4 space-y-6 overflow-y-scroll h-[80vh] max-w-screen-md mx-auto bg-gray-100">
      <div className="flex flex-col space-y-6">
        {myPost?.tweets?.length > 0 ? (
          myPost.tweets.map((post, index) => (
            <MyPostCard key={index} post={post} />
          ))
        ) : (
          <p className="text-gray-600">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default MyPost;
