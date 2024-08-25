import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { backendUrl } from "../../constant";
import { useSelector } from "react-redux";

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
    if (!updatePassword.newPassword)
      return toast.error("Enter new password");
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
      toast.success("Password updated successfully");
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to update password");
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
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
