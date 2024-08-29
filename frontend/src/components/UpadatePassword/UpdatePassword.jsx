import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { backendUrl } from "../../constant";
import { useSelector } from "react-redux";
import Spinner from "../ResusableComponents/Spinner";
import { errorToast, successToast } from "../ResusableComponents/NotifyToast";

const UpdatePassword = ({ id }) => {
  const [updatePassword, setUpdatePassword] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const handleOnPasswordChange = (e) => {
    const { name, value } = e.target;
    setUpdatePassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnPasswordUpdate = async (e) => {
    e.preventDefault();
    if (!updatePassword.password)
      return toast.error("Enter your current password");
    if (!updatePassword.newPassword) return toast.error("Enter new password");
    if (!updatePassword.confirmPassword)
      return toast.error("Enter confirm password");
    if (updatePassword.newPassword !== updatePassword.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${backendUrl}/api/v1/users/updatepassword/${id}`,
        {
          currentPassword: updatePassword.password,
          newPassword: updatePassword.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      successToast("Password updated successfully");
    } catch (error) {
      errorToast("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleOnPasswordUpdate}>
        <div className="mb-4">
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium mb-1"
          >
            Current Password
          </label>
          <input
            onChange={handleOnPasswordChange}
            type="password"
            name="password"
            id="currentPassword"
            className="block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium mb-1"
          >
            New Password
          </label>
          <input
            onChange={handleOnPasswordChange}
            type="password"
            name="newPassword"
            id="newPassword"
            className="block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1"
          >
            Confirm New Password
          </label>
          <input
            onChange={handleOnPasswordChange}
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            className="block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Upadate password"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
