import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { backendUrl } from "../../constant";
import { updateUser } from "../../store/slices/userSlice";
import { RiArrowGoBackFill } from "react-icons/ri";
import UpdatePassword from "../UpadatePassword/UpdatePassword";

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
    e.preventDefault();
    const { name, value, files } = e.target;
    if (name === "coverImage" || name === "profileImage") {
      setUserInput((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setUserInput((prevInp) => ({ ...prevInp, [name]: value }));
    }
  };

  const handleOnProfileUpdate = async (e) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", userInput.fullName);
      if (userInput.coverImage) {
        formData.append("coverImage", userInput.coverImage);
      }
      if (userInput.profileImage) {
        formData.append("profileImage", userInput.profileImage);
      }

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
              {userInput.coverImage ? (
                <img
                  src={URL.createObjectURL(userInput.coverImage)}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                profile?.coverImage && (
                  <img
                    src={profile.coverImage}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                )
              )}
              <label
                htmlFor="coverImageInput"
                className="absolute bottom-0 right-0 bg-black text-white px-2 py-1 rounded-tl-xl cursor-pointer"
              >
                <span>edit</span>
              </label>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              <input
                onChange={handleOnChange}
                type="file"
                name="profileImage"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                id="profileImageInput"
              />
              <div className="w-24 h-24 bg-gray-300 border-4 border-white rounded-full overflow-hidden relative">
                {userInput.profileImage ? (
                  <img
                    src={URL.createObjectURL(userInput.profileImage)}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile?.profileImage && (
                    <img
                      src={profile?.profileImage}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  )
                )}
                <label
                  htmlFor="profileImageInput"
                  className="absolute bottom-0 right-1 bg-black z-50 text-white px-2 py-1 rounded-tl-xl cursor-pointer"
                >
                  <span>edit</span>
                </label>
              </div>
            </div>
          </div>

          <form onSubmit={handleOnProfileUpdate} className="space-y-4 mt-4">
            <div className="lg:flex lg:justify-around">
              <div className="flex flex-col w-full">
                <label
                  htmlFor="fullName"
                  className="mb-1 font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  onChange={handleOnChange}
                  value={userInput.fullName}
                  type="text"
                  name="fullName"
                  className="p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              type="submit"
              className={`w-fit py-2 px-4 rounded-md bg-[#18181B] text-white hover:bg-gray-600 transition-all ease-in-out`}
              disabled={loading}
            >
              {loading ? (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 mr-2 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C
                    ...27.4013 9.67226 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.3561 50.5908C93.3561 74.6042 74.8317 93.7905 50 93.7905C25.1683 93.7905 6.6439 74.6042 6.6439 50.5908C6.6439 26.5773 25.1683 7.39102 50 7.39102C74.8317 7.39102 93.3561 26.5773 93.3561 50.5908ZM8.7267 50.5908C8.7267 72.6084 26.4366 90.3182 50 90.3182C73.5634 90.3182 91.2733 72.6084 91.2733 50.5908C91.2733 28.5732 73.5634 10.8633 50 10.8633C26.4366 10.8633 8.7267 28.5732 8.7267 50.5908Z"
                    fill="#D1D5DB"
                  />
                </svg>
              ) : (
                "Update Profile"
              )}
            </button>
            <button onClick={handleBackClick} className="mx-2">
              <RiArrowGoBackFill />
            </button>
          </form>

          {/* Include the new UpdatePassword component */}
          {id && <UpdatePassword id={id} />}
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
