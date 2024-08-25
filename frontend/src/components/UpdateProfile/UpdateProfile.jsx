import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { backendUrl } from "../../constant";
import { updateUser } from "../../store/slices/userSlice";
import { RiArrowGoBackFill } from "react-icons/ri";
import UpdatePassword from "../UpadatePassword/UpdatePassword";
import Spinner from "../ResusableComponents/Spinner";

const UpdateProfile = () => {
  const [userInput, setUserInput] = useState({
    fullName: "",
    coverImage: null,
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { profile, user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const id = user?.user?._id;
  const token = useSelector((state) => state.auth.token);

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setUserInput((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setUserInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOnProfileUpdate = async (e) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", userInput.fullName);
      if (userInput.coverImage)
        formData.append("coverImage", userInput.coverImage);
      if (userInput.profileImage)
        formData.append("profileImage", userInput.profileImage);

      const res = await axios.put(
        `${backendUrl}/api/v1/users/updateuserprofile/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      dispatch(updateUser(res.data));
      toast.success("Profile updated successfully");
      navigate("/home");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(`/profile/${profile?._id}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {isAuthenticated && (
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg relative">
          <div className="relative">
            <input
              onChange={handleOnChange}
              type="file"
              name="coverImage"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              id="coverImageInput"
            />
            <div className="h-32 bg-gray-200 overflow-hidden relative rounded-t-lg">
              <img
                src={
                  userInput.coverImage
                    ? URL.createObjectURL(userInput.coverImage)
                    : profile?.coverImage
                }
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
              <label
                htmlFor="coverImageInput"
                className="absolute bottom-0 right-0 bg-black text-white px-2 py-1 rounded-tl-xl cursor-pointer"
              >
                <span>Edit</span>
              </label>
            </div>
            <input
              onChange={handleOnChange}
              type="file"
              name="profileImage"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              id="profileImageInput"
            />
            <div className="w-24 h-24 bg-gray-300 border-4 border-white rounded-full overflow-hidden relative mx-auto -mt-12">
              <img
                src={
                  userInput.profileImage
                    ? URL.createObjectURL(userInput.profileImage)
                    : profile?.profileImage
                }
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
              <label
                htmlFor="profileImageInput"
                className="absolute bottom-0 right-1 bg-black z-50 text-white px-2 py-1 rounded-tl-xl cursor-pointer"
              >
                <span>Edit</span>
              </label>
            </div>
          </div>

          <form onSubmit={handleOnProfileUpdate} className="space-y-4 mt-4">
            <div className="flex flex-col">
              <label
                htmlFor="fullName"
                className="mb-1 font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                onChange={handleOnChange}
                value={
                  profile?.fullName ? userInput.fullName : profile?.fullName
                }
                type="text"
                name="fullName"
                id="fullName"
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md bg-black text-white hover:bg-gray-600 transition-all ease-in-out"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Update Profile"}
            </button>
            <button
              type="button"
              onClick={handleBackClick}
              className="flex items-center space-x-2 mt-4 text-blue-500 hover:underline"
            >
              <RiArrowGoBackFill />
              <span>Back</span>
            </button>
          </form>

          {id && <UpdatePassword id={id} />}
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
