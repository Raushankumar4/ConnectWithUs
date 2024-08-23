# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

import React, { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
const [userInput, setUserInput] = useState({
fullName: "",
username: "",
email: "",
password: "",
coverImage: null,
profileImage: null,
});

const [errors, setErrors] = useState({});
const navigate = useNavigate();
const imageRef = useRef();

const handleClick = () => {
imageRef.current.click();
};

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

    // Create FormData object
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
      const res = await axios.post(
        "http://localhost:4000/api/v1/users/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      // Display error message from backend
      toast.error(error.response.data.message || "Registration failed");
    }

};

const handleOnChange = (e) => {
const { name, value } = e.target;
if (name === "coverImage" || name === "profileImage") {
setUserInput((prevInput) => ({
...prevInput,
[name]: e.target.files[0],
}));
} else {
setUserInput((prevInput) => ({
...prevInput,
[name]: value,
}));
}
};

return (
<div className="h-screen mx-0 flex items-center justify-center bg-gray-100">
<div className="flex items-center justify-center w-full h-full border-2 border-black">
<div className="w-2/3 h-fit bg-lightblue-500 border-2 border-blue-500">
<form
            onSubmit={handleOnSubmit}
            className="flex flex-col space-x-4 space-y-4 p-4"
          >
<h1 className="text-center py-1">Register</h1>
<label htmlFor="fullName">Full Name</label>
<input
              onChange={handleOnChange}
              type="text"
              name="fullName"
              value={userInput.fullName}
            />
{errors.fullName && (
<span className="text-red-500">{errors.fullName}</span>
)}

            <label htmlFor="username">Username</label>
            <input
              onChange={handleOnChange}
              type="text"
              name="username"
              value={userInput.username}
            />
            {errors.username && (
              <span className="text-red-500">{errors.username}</span>
            )}

            <label htmlFor="email">Email</label>
            <input
              onChange={handleOnChange}
              type="email"
              name="email"
              value={userInput.email}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email}</span>
            )}

            <label htmlFor="password">Password</label>
            <input
              onChange={handleOnChange}
              type="password"
              name="password"
              value={userInput.password}
            />
            {errors.password && (
              <span className="text-red-500">{errors.password}</span>
            )}

            <label onClick={handleClick} htmlFor="coverImage">
              Cover Image
            </label>
            <input
              onChange={handleOnChange}
              type="file"
              name="coverImage"
              accept="image/*"
              ref={imageRef}
              style={{ display: "none" }}
            />

            <label onClick={handleClick} htmlFor="profileImage">
              Profile Image
            </label>
            <input
              onChange={handleOnChange}
              type="file"
              name="profileImage"
              accept="image/*"
              ref={imageRef}
              style={{ display: "none" }}
            />

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>

);
};

export default RegisterUser;
