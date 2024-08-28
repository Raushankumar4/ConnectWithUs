import React from "react";
import { useSelector } from "react-redux";
import OtherUserCard from "../PostCard/OtherUserCard";

const OtherUserDetails = () => {
  const { otherUsers } = useSelector((store) => store.user);
  return (
    <div>
      {otherUsers?.data?.map((otherUser, index) => (
        <OtherUserCard otherUser={otherUser} index={index} />
      ))}
    </div>
  );
};

export default OtherUserDetails;
