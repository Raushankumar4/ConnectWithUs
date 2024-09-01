import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { backendUrl } from "../../constant";
import { errorToast, successToast } from "../ResusableComponents/NotifyToast";
import {
  followUser,
  unfollowUser,
  toggleRefresh,
} from "../../store/slices/userSlice";

const OtherUserDetails = ({ userId }) => {
  const { otherUsers, user } = useSelector((store) => store.user);
  const token = useSelector((store) => store.auth.token);
  const dispatch = useDispatch();

  const otheruser = otherUsers.data.find((user) => user._id === userId);

  const isFollowing = user?.user?.following?.includes(userId);

  const handleOnfollow = async () => {
    try {
      const id = otheruser._id;
      const res = await axios.post(
        `${backendUrl}/api/v1/users/follow/${id}`,
        { id: user?.user?._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(followUser({ userId: user?.user?._id, followUserId: id }));
        successToast(res.data.message);
        dispatch(toggleRefresh());
      }
    } catch (error) {
      errorToast(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      const id = otheruser._id;
      const res = await axios.post(
        `${backendUrl}/api/v1/users/unfollow/${id}`,
        { id: user?.user?._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(unfollowUser({ userId: user?.user?._id, unfollowUserId: id }));
        successToast(res.data.message);
        dispatch(toggleRefresh()); // Trigger a refresh to get updated data
      }
    } catch (error) {
      errorToast(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  // Handle loading state
  if (!otheruser) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="-z-0 w-full max-w-lg mx-auto p-6 rounded-lg shadow-lg relative">
      {/* Cover Image */}
      <div className="relative">
        <img
          className="w-full h-32 object-cover rounded-t-lg"
          src={otheruser.coverImage || "/default-cover.jpg"}
          alt={`Cover image of ${otheruser.fullName}`}
        />
        {/* Profile Image */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <img
            className="w-24 h-24 rounded-full border-4 border-white -mt-12"
            src={otheruser.profileImage || "/default-profile.jpg"}
            alt={`Profile image of ${otheruser.fullName}`}
          />
        </div>
      </div>

      {/* User Details */}
      <div className="pt-16 text-center">
        <h2 className="text-2xl font-semibold">{otheruser?.fullName}</h2>
        <p className="text-md text-gray-700">@{otheruser?.username}</p>

        {/* Follow/Unfollow Button */}
        <div className="flex justify-center mt-4">
          {isFollowing ? (
            <button
              onClick={handleUnfollow}
              className="px-4 py-2 text-white rounded-lg bg-gray-500 hover:bg-gray-600 ml-4"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={handleOnfollow}
              className="px-4 py-2 tracking-wide text-white rounded-lg bg-black hover:bg-gray-600 ml-4"
            >
              Follow
            </button>
          )}
        </div>

        {/* Follow/Followers Counts */}
        <div className="flex justify-around mt-4 border-t pt-4">
          <div className="text-center">
            <p className="text-lg font-semibold">
              {otheruser?.followers?.length || 0}
            </p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">
              {otheruser?.following?.length || 0}
            </p>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserDetails;
