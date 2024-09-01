// Following.js
import React from "react";
import FollowingPost from "../FollowingPost/FollowingPost";

const Following = () => {
  return (
    <div className="w-full h-screen box-content text-center py-4">
      <h2 className="text-2xl font-bold">Following</h2>
      <FollowingPost />
    </div>
  );
};

export default Following;
