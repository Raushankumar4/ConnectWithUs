import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../../constant";
import toast from "react-hot-toast";
import { getCreatedTweets } from "../../store/slices/userSlice";

const Post = () => {
  const [post, setPost] = useState({
    description: "",
    postImage: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  const { user } = useSelector((store) => store.user);
  const userId = user?.user?._id;

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "postImage") {
      const file = files[0];
      setPost((prevPost) => ({ ...prevPost, [name]: file }));
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setPost((prevPost) => ({ ...prevPost, [name]: value }));
    }
  };

  const handleOnPost = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !userId || !token) {
      handleError("User not authenticated or missing parameters.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("id", userId);
      formData.append("description", post.description);
      if (post.postImage) {
        formData.append("postImage", post.postImage);
      }

      const res = await axios.post(
        `${backendUrl}/api/v1/tweet/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      dispatch(getCreatedTweets({ tweet: res.data }));
      toast.success(res.data.message);
      navigate("/home");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred";
      handleError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (message) => {
    setError(message);
    toast.error(message);
  };

  const handleRemoveImage = () => {
    setPost((prevPost) => ({ ...prevPost, postImage: null }));
    setImagePreview("");
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <div className="absolute top-4 left-4 flex items-center space-x-4">
          <img
            src={user?.user?.profileImage}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="text-left">
            <h2 className="text-lg font-semibold">{user?.user?.fullName}</h2>
          </div>
        </div>
        <form onSubmit={handleOnPost} className="pt-24 pl-20">
          <h1 className="text-2xl mb-4">Create a Post</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700">
              Description
            </label>
            <input
              onChange={handleOnChange}
              type="text"
              value={post.description}
              name="description"
              id="description"
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="postImage"
              className="text-white text-sm bg-black p-3 rounded-lg w-10 h-10"
            >
              Add +
            </label>
            <input
              onChange={handleOnChange}
              type="file"
              accept="image/*"
              name="postImage"
              id="postImage"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Cover Preview"
                  className="w-full h-48 object-cover mt-4"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-lg border border-gray-300"
                >
                  <span className="text-black text-lg">&times;</span>
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
              } text-white py-2 px-4 rounded`}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
