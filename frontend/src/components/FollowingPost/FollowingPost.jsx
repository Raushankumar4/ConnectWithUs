import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendUrl } from "../../constant";

const FollowingPost = () => {
  const token = useSelector((store) => store.auth.token);
  const { user } = useSelector((store) => store.user);
  const id = user?.user?._id;

  const dispatch = useDispatch();

  useEffect(() => {
    const getAllFollowingPost = async () => {
      if (!id || !token) return;
      try {
        const res = await axios.get(
          `${backendUrl}/api/v1/tweet/getallfollowingtweets/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        // dispatch(getAllFollowingPost(res?.data));
        console.log("hh", res?.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getAllFollowingPost();
  }, []);

  return <div>FollowingPost</div>;
};

export default FollowingPost;
