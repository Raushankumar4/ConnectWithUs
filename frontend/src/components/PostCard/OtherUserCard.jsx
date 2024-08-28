import React from "react";

const OtherUserCard = ({ otherUser, index }) => {
  return (
    <div>
      <div
        key={index}
        className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75"
      >
        <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
            &times;
          </button>
          {/* Cover Image */}
          <div className="relative">
            <img
              className="w-full h-32 object-cover rounded-t-lg"
              src={otherUser?.coverImage || "/default-cover.jpg"}
              alt="User's cover"
            />
          </div>
          {/* Profile Image */}
          <div className="flex flex-col items-center z-50">
            <img
              className="w-24 z-50 h-24 rounded-full border-4 border-white -mt-12"
              src={otherUser?.profileImage || "/default-profile.jpg"}
              alt="User's profile"
            />
            <h2 className="text-xl font-semibold mt-2">
              {otherUser?.fullName}
            </h2>
            <p className="text-sm text-gray-500">@{otherUser?.username}</p>
          </div>
          {/* Follow/Unfollow Button */}
          <div className="flex justify-center mt-4">
            <button className="px-4 py-2 text-white rounded-lg      bg-blue-500 hover:bg-blue-600">
              {/* {isFollowing ? "Unfollow" : "Follow"} */}
              Following
            </button>
          </div>
          {/* Follow/Followers Counts */}
          <div className="flex justify-around mt-4 border-t pt-2">
            <div className="text-center">
              <p className="text-lg font-semibold">
                {otherUser?.follower || 0}
              </p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">
                {otherUser?.followings || 0}
              </p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserCard;
