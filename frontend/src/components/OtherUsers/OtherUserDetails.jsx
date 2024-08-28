import React from "react";
import { useSelector } from "react-redux";

const OtherUserDetails = ({ userId }) => {
  const { otherUsers } = useSelector((store) => store.user);
  const user = otherUsers?.data.find((user) => user._id === userId);

  if (!user) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="-z-0 w-full  max-w-lg mx-auto p-6 rounded-lg shadow-lg relative">
      {/* Cover Image */}
      <div className="relative ">
        <img
          className="w-full h-32 object-cover rounded-t-lg"
          src={user.coverImage || "/default-cover.jpg"}
          alt={`Cover image of ${user.fullName}`}
        />
        {/* Profile Image */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <img
            className="w-24 h-24 rounded-full border-4 border-white -mt-12"
            src={user.profileImage || "/default-profile.jpg"}
            alt={`Profile image of ${user.fullName}`}
          />
        </div>
      </div>

      {/* User Details */}
      <div className="pt-16 text-center">
        <h2 className="text-2xl font-semibold">{user.fullName}</h2>
        <p className="text-md text-gray-700">@{user.username}</p>

        {/* Follow/Unfollow Button */}
        <div className="flex justify-center mt-4">
          <button className="px-4 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-600">
            Follow
          </button>

          {/* <button
            className="px-4 py-2 text-white rounded-lg bg-gray-500 hover:bg-gray-600 ml-4"
          >
            Unfollow
          </button> */}
        </div>

        {/* Follow/Followers Counts */}
        <div className="flex justify-around mt-4 border-t pt-4">
          <div className="text-center">
            <p className="text-lg font-semibold">{user.follower || 0}</p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{user.followings || 0}</p>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserDetails;
