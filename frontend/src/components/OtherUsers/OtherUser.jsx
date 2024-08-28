import React, { useState } from "react";
import { useGetOtherUsers } from "../../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";
import OtherUserModel from "../ResusableComponents/OtherUserModel";

const OtherUser = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { user, otherUsers } = useSelector((store) => store.user);
  useGetOtherUsers(user?.user?._id);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <div>
      {otherUsers?.data?.map((otherUser) => (
        <div key={otherUser?._id} className="flex items-center space-x-4 p-4">
          <img
            className="w-12 h-12 rounded-full"
            src={otherUser?.profileImage}
            alt="User's profile picture"
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{otherUser?.fullName}</h2>
            <p className="text-sm text-gray-500">@{otherUser?.username}</p>
          </div>
          <button
            onClick={() => handleOpenModal(otherUser)}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg"
          >
            Profile
          </button>
        </div>
      ))}

      {/* Render the Modal component */}
      <OtherUserModel
        isOpen={!!selectedUser}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </div>
  );
};

export default OtherUser;
