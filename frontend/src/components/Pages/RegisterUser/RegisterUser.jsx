import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { backendUrl } from "../../../constant";
import InputField from "../../ResusableComponents/InputField";
import ImagePreview from "../../ResusableComponents/ImagePreview";
import Spinner from "../../ResusableComponents/Spinner";
import {
  errorToast,
  successToast,
} from "../../ResusableComponents/NotifyToast";

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
    if (!userInput.coverImage) {
      newErrors.coverImage = "Cover Image is required";
    }
    if (!userInput.profileImage) {
      newErrors.profileImage = "Profile Image is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
      successToast(response.data.message);
      navigate("/login");
    } catch (error) {
      errorToast(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setUserInput((prevInput) => ({
        ...prevInput,
        [name]: file,
      }));

      // Set image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prevPreviews) => ({
          ...prevPreviews,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setUserInput((prevInput) => ({
        ...prevInput,
        [name]: value,
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <div className="relative">
          <ImagePreview
            image={imagePreviews.coverImage}
            onChange={handleOnChange}
            name="coverImage"
            label="Cover Image"
          />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <ImagePreview
              image={imagePreviews.profileImage}
              onChange={handleOnChange}
              name="profileImage"
              label="Profile Image"
              isProfileImage={true}
            />
          </div>
        </div>

        <h1 className="text-center text-3xl font-semibold mb-6 text-gray-800">
          Create an account
        </h1>

        <form onSubmit={handleOnSubmit} className="space-y-4">
          <InputField
            type="text"
            name="fullName"
            value={userInput.fullName}
            onChange={handleOnChange}
            label="Full Name"
            error={errors.fullName}
          />
          <InputField
            type="text"
            name="username"
            value={userInput.username}
            onChange={handleOnChange}
            label="Username"
            error={errors.username}
          />
          <InputField
            type="email"
            name="email"
            value={userInput.email}
            onChange={handleOnChange}
            label="Email"
            error={errors.email}
          />
          <InputField
            type="password"
            name="password"
            value={userInput.password}
            onChange={handleOnChange}
            label="Password"
            error={errors.password}
          />

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md bg-[#18181B] text-white hover:bg-gray-600 transition-all ease-in-out`}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Sign Up"}
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
