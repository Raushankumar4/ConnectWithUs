// ForYou.js
import React from "react";
import MyPost from "../Mypost/MyPost";
import { useGetAllPost } from "../../hooks/useGetAllPost";
import { useSelector } from "react-redux";

const ForYou = () => {
  const { user } = useSelector((store) => store.user);
  useGetAllPost(user?.user?._id);
  return (
    <div className="w-full h-screen box-content text-center py-4">
      <h2 className="text-2xl font-bold">For You</h2>
      <MyPost />
    </div>
  );
};

export default ForYou;
