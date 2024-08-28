import React, { useState } from "react";
import { useGetOtherUsers } from "../../hooks/useGetOtherUsers";
import Modal from "../ResusableComponents/Modal";
import { useSelector } from "react-redux";
import OtherUserDetails from "./OtherUserDetails";

const OtherUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, otherUsers } = useSelector((store) => store.user);
  useGetOtherUsers(user?.user?._id);

  const toggleModal = () => setIsOpen((prev) => !prev);

  return (
    <div>
      {otherUsers?.data?.map((otherUser, index) => (
        <div key={index} className="flex items-center space-x-4 p-4">
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
            onClick={toggleModal}
            className="mt-4 p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
          >
            {isOpen ? "" : "Profile"}
          </button>
        </div>
      ))}

      <Modal isOpen={isOpen} onClose={toggleModal}>
        <OtherUserDetails />
      </Modal>
    </div>
  );
};

export default OtherUser;
