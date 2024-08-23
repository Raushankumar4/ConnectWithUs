import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { CiCamera } from "react-icons/ci";
import { backendUrl } from "../../../constant";


const RegisterUser = () => {
  const [userInput, setUserInput] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    coverImage: null,
    profileImage: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    coverImage: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!userInput.fullName) newErrors.fullName = "Full Name is required";
    if (!userInput.username) newErrors.username = "Username is required";
    if (!userInput.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userInput.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!userInput.password) {
      newErrors.password = "Password is required";
    } else if (userInput.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!userInput.coverImage) {
      return toast.error("Cover Image Required");
    } else {
      if (!userInput.profileImage) return toast.error("Profile Image Required");
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("fullName", userInput.fullName);
    formData.append("username", userInput.username);
    formData.append("email", userInput.email);
    formData.append("password", userInput.password);
    if (userInput.coverImage) {
      formData.append("coverImage", userInput.coverImage);
    }
    if (userInput.profileImage) {
      formData.append("profileImage", userInput.profileImage);
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/users/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Success Response:", response.data);

      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverImage" || name === "profileImage") {
      // Set file input
      setUserInput((prevInput) => ({
        ...prevInput,
        [name]: files[0],
      }));

      // Set image preview
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prevPreviews) => ({
            ...prevPreviews,
            [name]: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setUserInput((prevInput) => ({
        ...prevInput,
        [name]: value,
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg relative">
        {/* Cover Image Section */}
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
            {imagePreviews.coverImage ? (
              <img
                src={imagePreviews.coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              ""
            )}
            <label
              htmlFor="coverImageInput"
              className="absolute bottom-0 right-0 bg-black text-white px-2 py-1  rounded-tl-xl cursor-pointer"
            >
              <CiCamera />
            </label>
          </div>
          {/* Profile Image Section */}
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
              {imagePreviews.profileImage ? (
                <img
                  src={imagePreviews.profileImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                ""
              )}
              <label
                htmlFor="profileImageInput"
                className="absolute bottom-0 right-1 bg-black text-white px-2 py-1 rounded-tl-md  cursor-pointer"
              >
                <CiCamera />
              </label>
            </div>
          </div>
        </div>

        <h1 className="text-center text-3xl font-semibold mb-6 text-gray-800 my-10">
          Create an account
        </h1>

        <form onSubmit={handleOnSubmit} className="space-y-4">
          <div className="lg:flex lg:justify-around">
            <div className="flex flex-col">
              <label
                htmlFor="fullName"
                className="mb-1 font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                onChange={handleOnChange}
                type="text"
                name="fullName"
                value={userInput.fullName}
                className="p-2 lg:w-fit border border-gray-300 rounded-md"
              />
              {errors.fullName && (
                <span className="text-red-500">{errors.fullName}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="username"
                className="mb-1 font-medium text-gray-700"
              >
                Username
              </label>
              <input
                onChange={handleOnChange}
                type="text"
                name="username"
                value={userInput.username}
                className="p-2 lg:w-fit border border-gray-300 rounded-md"
              />
              {errors.username && (
                <span className="text-red-500">{errors.username}</span>
              )}
            </div>
          </div>

          <div className="lg:flex lg:justify-between ">
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                onChange={handleOnChange}
                type="email"
                name="email"
                value={userInput.email}
                className="p-2 lg:w-fit border border-gray-300 rounded-md"
              />
              {errors.email && (
                <span className="text-red-500">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="mb-1 font-medium text-gray-700"
              >
                Password
              </label>
              <input
                onChange={handleOnChange}
                type="password"
                name="password"
                value={userInput.password}
                className="p-2 lg:w-fit border border-gray-300 rounded-md"
              />
              {errors.password && (
                <span className="text-red-500">{errors.password}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2  px-4 rounded-md bg-[#18181B] text-white hover:bg-gray-600 transition-all ease-in-out`}
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
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.3561 50.5908C93.3561 74.6042 74.8317 93.7905 50 93.7905C25.1683 93.7905 6.6439 74.6042 6.6439 50.5908C6.6439 26.5773 25.1683 7.39102 50 7.39102C74.8317 7.39102 93.3561 26.5773 93.3561 50.5908ZM8.7267 50.5908C8.7267 72.6084 26.4366 90.3182 50 90.3182C73.5634 90.3182 91.2733 72.6084 91.2733 50.5908C91.2733 28.5732 73.5634 10.8633 50 10.8633C26.4366 10.8633 8.7267 28.5732 8.7267 50.5908Z"
                  fill="#D1D5DB"
                />
              </svg>
            ) : (
              "Sign Up"
            )}
          </button>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
