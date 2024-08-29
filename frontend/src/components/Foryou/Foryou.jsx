import React from "react";
import AllPost from "../UserPost/AllPost";

const ForYou = () => {
  return (
    <div className="w-full h-screen box-content text-center py-4">
      <h2 className="text-2xl font-bold">For You</h2>

      <AllPost />
    </div>
  );
};

export default ForYou;
