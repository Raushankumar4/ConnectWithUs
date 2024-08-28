import React, { useState } from "react";
import { useGetOtherUsers } from "../../hooks/useGetOtherUsers";
import Modal from "../ResusableComponents/Modal";
import { useSelector } from "react-redux";
import OtherUserDetails from "./OtherUserDetails";

const OtherUser = () => {
  const [openUserId, setOpenUserId] = useState(null);
  const { user, otherUsers } = useSelector((store) => store.user);
  useGetOtherUsers(user?.user?._id);

  const openModal = (userId) => setOpenUserId(userId);
  const closeModal = () => setOpenUserId(null);

  return (
    <div>
      {otherUsers?.data?.map((otherUser) => (
        <div
          key={otherUser._id}
          className="border-2 border-b-gray-100 flex items-center space-x-4 p-4"
        >
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
            onClick={() => openModal(otherUser._id)}
            className="mt-4 z-50 p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
          >
            Profile
          </button>
        </div>
      ))}

      <Modal isOpen={!!openUserId} onClose={closeModal}>
        {openUserId && <OtherUserDetails userId={openUserId} />}
      </Modal>
    </div>
  );
};

export default OtherUser;
